import React, { forwardRef } from "react";
import WorkIcon from "@material-ui/icons/Work";
import ViewListIcon from "@material-ui/icons/ViewList";
import { Link, LinkProps } from "react-router-dom";
import AssetsTopBar from "../header/trader/assets/AssetsTopBar";
import { Omit } from '@material-ui/types';
import AssetsContents from "../contents/trader/assets/AssetsContents";
import DirectoryContents from "../contents/mills/directory/DirectoryContents"
import DirectoryTopBar from "../header/mills/directory/DirectoryTopBar"
import TransactionsContents from "../contents/trader/transactions/TransactionsContents";
import TransactionsTopBar from "../header/trader/transactions/TransactionsTopBar";

export type NavItemChildren = {
	id: string
	group: string[]
	icon: JSX.Element
	path: string
	link: any
	content: any
	header: ()=> JSX.Element
}

export type NavItem = {
	id: string
	group : string[]
	children: NavItemChildren[]
}

const navItems: NavItem[] = [
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
				content: AssetsContents,
				header: () => <AssetsTopBar />
				
			},
			{
				id: "Transactions",
				group: [],
				icon: <WorkIcon />,
				path: "/transactions",
				link: forwardRef<HTMLAnchorElement, Omit<LinkProps, 'innerRef' | 'to'>>(
					(props, ref) => <Link innerRef={ref as any} to="/transactions/" {...props} />,
				),
				content: TransactionsContents,
				header: () => <TransactionsTopBar />
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
				path: "/directory",
				link: forwardRef<HTMLAnchorElement, Omit<LinkProps, 'innerRef' | 'to'>>(
					(props, ref) => <Link innerRef={ref as any} to="/directory/" {...props} />,
				),
				content: DirectoryContents,
				header: () => <DirectoryTopBar/ >
			},

		]
	}
];

export default navItems;

