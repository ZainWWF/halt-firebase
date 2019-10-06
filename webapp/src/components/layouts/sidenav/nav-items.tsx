import React, { forwardRef } from "react";
import WorkIcon from "@material-ui/icons/Work";
import ViewListIcon from "@material-ui/icons/ViewList";
import { Link, LinkProps } from "react-router-dom";
import AssetsTopBar from "../header/assets/AssetsTopBar";
import { Omit } from '@material-ui/types';
import AssetsContents from "../contents/trader/assets/AssetsContents";



const navItems = [
	{
		id: "Trader",
		group: [],
		children: [
			{
				id: "Assets",
				group: [],
				icon: <WorkIcon />,
				path: "/assets",
				link: forwardRef<HTMLAnchorElement, Omit<LinkProps, 'innerRef' | 'to'>>(
					(props, ref) => <Link innerRef={ref as any} to="/assets/" {...props} />,
				),
				content: <AssetsContents key="assets-contents" />,
				header: () => <AssetsTopBar />
			},

		]
	},
	{
		id: "Mills",
		group: [],
		children: [
			{
				id: "Directory",
				group: [],
				icon: <ViewListIcon />,
				path: "/mills",
				link: forwardRef<HTMLAnchorElement, Omit<LinkProps, 'innerRef' | 'to'>>(
					(props, ref) => <Link innerRef={ref as any} to="/mills/" {...props} />,
				),
				content: <div key="mills-contents" />,
				header: () => <div />
			},

		]
	}
];

export default navItems;
