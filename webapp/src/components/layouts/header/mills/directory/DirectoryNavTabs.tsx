import React, { forwardRef, FunctionComponent } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Link, withRouter, LinkProps, RouteComponentProps } from "react-router-dom";
import { Omit } from "@material-ui/types";

const ListingLink = forwardRef<HTMLAnchorElement, Omit<LinkProps, "innerRef" | "to">>(
	(props, ref) => <Link innerRef={ref as any} to="/directory/listing" {...props} />,
)
const NavTabs: FunctionComponent<RouteComponentProps> = ({ location })=> {
	const t = ["listings"].filter(v => location.pathname.indexOf(v) > 1)
	const tabValue = t.length !== 0 ? t[0] : "listings"
	return (
		<Tabs value={tabValue} variant="scrollable" scrollButtons="auto">
			<Tab textColor="inherit" label="Listings" value="listings" component={ListingLink} />
		</Tabs>
	)
}

export default withRouter(NavTabs)