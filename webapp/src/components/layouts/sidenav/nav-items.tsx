import React, { forwardRef } from "react";
import WorkIcon from "@material-ui/icons/Work";
import { Link, LinkProps } from "react-router-dom";
import AssetsTopBar from "../header/assets/AssetsTopBar";
import { Omit } from '@material-ui/types';
import AssetsContents from "../contents/assets/AssetsContents";

const navItems = [
  {
    id: "",
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
        content: <AssetsContents key="assets-contents"/>,
        header: () => <AssetsTopBar />
			},

    ]
  }
];

export default navItems;
