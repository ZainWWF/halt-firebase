import React, { forwardRef, FunctionComponent } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Link, withRouter, LinkProps, RouteComponentProps } from "react-router-dom";
import { Omit } from "@material-ui/types";

const VehiclesLink = forwardRef<HTMLAnchorElement, Omit<LinkProps, "innerRef" | "to">>(
	(props, ref) => <Link innerRef={ref as any} to="/assets/vehicles" {...props} />,
)
const PlantationsLink = forwardRef<HTMLAnchorElement, Omit<LinkProps, "innerRef" | "to">>(
	(props, ref) => <Link innerRef={ref as any} to="/assets/plantations" {...props} />,
)
const NavTabs: FunctionComponent<RouteComponentProps> = ({ location })=> {
	const t = ["plantations","vehicles"].filter(v => location.pathname.indexOf(v) > 1)
	const tabValue = t.length !== 0 ? t[0] : "plantations"
	return (
		<Tabs value={tabValue} variant="scrollable" scrollButtons="auto">
			<Tab textColor="inherit" label="Plantations" value="plantations" component={PlantationsLink} />
			<Tab textColor="inherit" label="Vehicles" value="vehicles" component={VehiclesLink} />
		</Tabs>
	)
}

export default withRouter(NavTabs)