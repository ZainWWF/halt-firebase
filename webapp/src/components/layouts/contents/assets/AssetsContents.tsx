import React, { memo } from 'react';
import { Switch, Route } from 'react-router-dom';
import VehiclesView from './vehicles/VehiclesView';
import PlantationsView from './plantations/PlantationsView';

const VehiclesContents = memo(() => {

	return (
		<Switch>
			<Route
				path="/assets/vehicles"
				component={() => <VehiclesView />}
			/>
			<Route
				path="/assets/plantations"
				component={() => <PlantationsView />}
			/>
		</Switch>
	);
});

export default VehiclesContents;
