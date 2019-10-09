import React, { forwardRef, FunctionComponent } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Link, withRouter, LinkProps, RouteComponentProps } from "react-router-dom";
import { Omit } from "@material-ui/types";

const PendingLink = forwardRef<HTMLAnchorElement, Omit<LinkProps, "innerRef" | "to">>(
	(props, ref) => <Link innerRef={ref as any} to="/transactions/pending" {...props} />,
)
const CompletedLink = forwardRef<HTMLAnchorElement, Omit<LinkProps, "innerRef" | "to">>(
	(props, ref) => <Link innerRef={ref as any} to="/transactions/completed" {...props} />,
)

const RejectedLink = forwardRef<HTMLAnchorElement, Omit<LinkProps, "innerRef" | "to">>(
	(props, ref) => <Link innerRef={ref as any} to="/transactions/rejected" {...props} />,
)

const NavTabs: FunctionComponent<RouteComponentProps> = ({ location }) => {
	const t = ["pending", "completed", "rejected"].filter(v => location.pathname.indexOf(v) > 1)
	const tabValue = t.length !== 0 ? t[0] : "pending"
	return (
		<Tabs value={tabValue} variant="scrollable" scrollButtons="auto">
			<Tab textColor="inherit" label="Pending" value="pending" component={PendingLink} />
			<Tab textColor="inherit" label="Completed" value="completed" component={CompletedLink} />
			<Tab textColor="inherit" label="Rejected" value="rejected" component={RejectedLink} />
		</Tabs>
	)
}

export default withRouter(NavTabs)