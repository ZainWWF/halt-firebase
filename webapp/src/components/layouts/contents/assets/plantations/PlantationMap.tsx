import React, { useRef, useEffect, useCallback, useState, FunctionComponent, Dispatch, SetStateAction, } from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core";
import * as SumatraMapBounds from "./PlantationMapBounds.json"
import * as turfHelpers from "@turf/helpers";
import * as turfContains from "@turf/boolean-contains";
declare global {
	interface Window { google: any; }
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		map: {
			width: 480,
			height: 480
		},

		dropContainer: {
			display: "none",
			height: "100%",
			width: "100%",
			position: "absolute",
			zIndex: 1,
			top: 0,
			left: 0,
			backgroundColor: "rgba(100, 100, 100, 0.5)"
		},

		dropSilhoutte: {
			color: "white",
			border: "white dashed 8px",
			height: "calc(100% - 15px)",
			width: "calc(100% - 15px)",
			backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAAZiS0dEAGQAZABkkPCsTwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90LHAIvICWdsKwAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAACdklEQVR42u3csU7icBzA8Xp3GBMSeRITH8JHMY7cRMvmVmXoE9TAcJubhjD4ApoiopgqDMWAKAgIcSAiCfxuwhwROVJbkPD9rP23ob8vpZCQKgoAAAAAAAAAAPDYyiK/eNM05bNtr6+vSjgcXiHxDMkE1WpVFvGcfpCVICAIQUAQgoAgBAFBCAKCgCAEAUEIAoIQBAQhCAgCghAEBCEICEIQEIQgIAgIQhAQhCAgCEFAEIKAICAIQUAQgoAgBAFBCDIzhmFINBo9/K6D0XVddnd3ZaneDY7jSCqVcn3SfjyeKRKJbJ2dnYllWbKUl2i5XJaXlxdJJBIy7yDHx8fy9vYm6XR6OWMM3d/fi4hIqVSSWCwmsw5ycHAgrVZLRETOz8+XO8ZQpVJ5H2Y6nRZN0/b9DqLruhSLxfd9MpkMMT6L0uv1JJlMih9BhveJwWDwvv7i4oIY4zw8PIwMtt1uSzweF6+CHB0dSbfbHVmbzWaJMcnj4+OHAd/d3cne3p64DWKapjw/P39Yd3l5SYxpVKvVsYO2LEtUVd2ZNoiu6+I4ztg1V1dXxPAiSq/Xk5OTk0k9pNVqyenp6ch94l+5XI4YbtRqNfHa9fX1t43xcwGa/Nnc3PwdDAY9OZht28rGxgZPvP6KSCSy9fT09OUrw7ZtPqa8jFKv113HuLm5IYbXVFXdcRPl9vaWGH5GaTQaU8fI5/PE8JumafvNZvO/MQqFAjFmJRqNHk6Ksqgx5vr1zzAM2d7edr3/6uqqsra2NnZbp9NR+v2+62OHQqG5zObXPIMEAgFlfX3dl2N79btl1viTA0FAEIKAIAQBAAAAAAAAsMz+Ai1bUgo6ebm8AAAAAElFTkSuQmCC');",
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center"
		}

	}),
);

interface IProps {
	setCanUpload: Dispatch<SetStateAction<boolean>>
	setHasError: Dispatch<SetStateAction<Error | undefined>>

}
const View: FunctionComponent<IProps> = ({ setHasError, setCanUpload }) => {
	const classes = useStyles();

	const [map, setMap] = useState<google.maps.Map>();
	const [newGeometry, setNewGeometry] = useState(null)
	const [mapViewBounds, setMapViewBounds] = useState<google.maps.LatLngBounds>()
	const [mapPolygonBounds, setMapPolygonBounds] = useState<turfHelpers.Feature<turfHelpers.Polygon>>()
	const mapRef = useRef(null)
	const dropContainerRef = useRef(null)
	const dropSilhoutteRef = useRef(null)

	// initalise the drawable bounds for the polygon
	const initMapPolygonBound = () => {
		const { features: [{ geometry: { coordinates } }] } = SumatraMapBounds;
		const boundPolygon = turfHelpers.polygon(coordinates)
		setMapPolygonBounds(boundPolygon)
	}

	// initialise the Map
	const initMapCallback = useCallback(() => {

		// initalise the drawable bounds for the polygon
		initMapPolygonBound()

		// the viewable bounds for the map
		const MAP_BOUNDS = {
			north: 14,
			east: 130,
			south: -14,
			west: 70,
		};

		const mapEl: any = mapRef.current;
		const initMap = new google.maps.Map(mapEl, {
			center: { lat: -0.0758334, lng: 101.6230565 },
			restriction: {
				latLngBounds: MAP_BOUNDS,
				strictBounds: false,
			},
			zoom: 8,
			mapTypeControl: true,
			mapTypeId: google.maps.MapTypeId.HYBRID,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				mapTypeIds: ['roadmap', "satellite", "hybrid"]
			}
		});

		initMap.setZoom(5)
		setMap(initMap)
	}, [])


	// zoom into the area of the polygon
	const zoomCallback = useCallback(() => {
		const bounds = new google.maps.LatLngBounds();
		if (map) {
			map.data.forEach(function (feature) {
				feature.getGeometry().forEachLatLng(function (g) {
					console.log(g.toUrlValue())
					bounds.extend(g)
				});
			});
			map.fitBounds(bounds);
			const listener = google.maps.event.addListener(map, "idle", function () {
				map.setZoom(12);
				google.maps.event.removeListener(listener);
			});
		}
	}, [map])


	// only a single feature/polygon is allowed to be mapped
	const checkFeatureHasSinglePolygon = useCallback(() => {
		let featureCount = 0;
		if (map) {
			map.data.forEach(function (feature) {
				if (featureCount > 0)
					throw new Error("Only a single Feature is allowed")
				featureCount = + 1;
				if (feature.getGeometry().getType() !== "Polygon")
					throw new Error("Only a Polygon geometry is allowed ")
			})
		}
	}, [map])

	// clear the map of any drawn polygon
	const removeAllFeatures = useCallback(() => {
		if (map) {
			map.data.forEach(function (feature) {
				map.data.remove(feature)
			})
		}
	}, [map]);


	//load the geojson into the map and render if it passes the checks
	const loadGeoJsonStringCallback = useCallback((geoString) => {
		try {
			const geojson = JSON.parse(geoString);
			if (map) {
				removeAllFeatures();
				map.data.addGeoJson(geojson);
				checkFeatureHasSinglePolygon()
				const { features: [{ geometry }] } = geojson

				const userPolygon = turfHelpers.polygon(geometry.coordinates)
				if (mapPolygonBounds) {
					const isInBound = turfContains.default(mapPolygonBounds, userPolygon)

					if (isInBound) {
						setNewGeometry(geometry)
					} else {
						throw new Error("geometry is out of bounds!")
					}
				}
				zoomCallback();
			}
		} catch (e) {
			setHasError(e)
		}
	}, [setHasError, checkFeatureHasSinglePolygon, removeAllFeatures, zoomCallback, map, mapViewBounds, mapPolygonBounds])


	const showPanelCallback = useCallback((e) => {
		e.stopPropagation();
		e.preventDefault();
		const dropContainerEl: any = dropContainerRef.current;
		dropContainerEl.style.display = 'block';
		return false;
	}, [])


	const hidePanel = () => {
		const dropContainerEl: any = dropContainerRef.current;
		dropContainerEl.style.display = 'none';
	}

	const handleDropCallback = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		hidePanel();

		const files = e.dataTransfer.files;
		if (files.length) {
			// process file(s) being dropped
			// grab the file data from each file
			for (let i = 0, file; (file = files[i]); i++) {
				const reader = new FileReader();
				reader.onload = function (e: any) {
					loadGeoJsonStringCallback(e.target.result);
				};
				reader.onerror = function (e) {
					console.error('reading failed');
				};
				reader.readAsText(file);
			}
		}
		else {
			// process non-file (e.g. text or html) content being dropped
			// grab the plain text version of the data
			const plainText = e.dataTransfer.getData('text/plain');
			if (plainText) {
				loadGeoJsonStringCallback(plainText);
			}
		}

		// prevent drag event from bubbling further
		return false;
	}, [loadGeoJsonStringCallback])


	const loadMapsApiCallback = useCallback(() => {
		if (!window.google) {
			const mapAPIScript = document.createElement('script')
			mapAPIScript.src = `https://maps.googleapis.com/maps/api/js?v=3.37&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;;
			mapAPIScript.addEventListener('load', initMapCallback);
			document.body.appendChild(mapAPIScript);
		} else {
			initMapCallback()
		}
	}, [initMapCallback])


	const getBoundsCallback = useCallback(() => {
		if (map) {
			const bounds = map.getBounds();

			console.log(bounds)
		};

	}, [map])

	useEffect(() => {
		const mapEl: any = mapRef.current;
		mapEl.addEventListener('dragenter', showPanelCallback, false);


		// overlay specific events (since it only appears once drag starts)
		const dropContainerEl: any = dropContainerRef.current;
		dropContainerEl.addEventListener('dragover', showPanelCallback, false);
		dropContainerEl.addEventListener('drop', handleDropCallback, false);
		dropContainerEl.addEventListener('dragleave', hidePanel, false);

		return () => {
			dropContainerEl.removeEventListener('dragover', showPanelCallback, false);
			dropContainerEl.removeEventListener('drop', handleDropCallback, false);
			dropContainerEl.removeEventListener('dragleave', hidePanel, false);
		}
	}, [showPanelCallback, handleDropCallback, getBoundsCallback])


	useEffect(() => {
		loadMapsApiCallback()
	}, [loadMapsApiCallback])

	useEffect(() => {
		if (newGeometry) {
			setCanUpload(true)
		}
	}, [newGeometry, setCanUpload])

	return (
		<>
			<div className={classes.map} ref={mapRef}></div>
			<div ref={dropContainerRef} className={classes.dropContainer}><div ref={dropSilhoutteRef} className={classes.dropSilhoutte}></div></div>
		</>
	)

}

export default View;
