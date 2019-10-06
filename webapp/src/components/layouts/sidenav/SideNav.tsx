/**
 *  SideNav Page where the navigation menus are located
 *  use withRouter to get the location property which
 *  can be used to sync the URL with selected menu item
 */
import React, { useContext, useState, useEffect, FunctionComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Theme  } from '@material-ui/core/styles';
import { makeStyles } from "@material-ui/core/styles";
import Divider from '@material-ui/core/Divider';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { SideNavContext } from '../../providers/SideNav/SideNavProvider';
import navItems from './nav-items';
import 'firebase/auth';
import classNames from 'classnames';
import { RouteComponentProps } from 'react-router';
import { ListSubheader } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
	categoryHeader: {
		paddingTop: 16,
		paddingBottom: 16
	},
	categoryHeaderPrimary: {
		color: theme.palette.common.white
	},
	backgroundImage :{
		backgroundImage: "url(../halt-side-banner-tesso-nilo.png)"
	},
	item: {
		paddingTop: 4,
		paddingBottom: 4,
		color: 'rgba(255, 255, 255, 0.7)'
	},
	itemCategory: {
		backgroundColor: '#232f3e',
		boxShadow: '0 -1px 0 #404854 inset',
		paddingTop: 16,
		paddingBottom: 16
	},
	avatarCategory: {
		backgroundColor: '#232f3e',
		paddingTop: 16,
		paddingBottom: 16,
		textAlign: 'center'
	},
	firebase: {
		fontSize: 24,
		fontFamily: theme.typography.fontFamily,
		color: theme.palette.common.white
	},
	itemActionable: {
		'&:hover': {
			backgroundColor: 'rgba(255, 255, 255, 0.08)'
		}
	},
	itemActiveItem: {
		color: theme.palette.common.white
	},
	itemPrimary: {
		color: 'inherit',
		fontSize: theme.typography.fontSize,
		'&$textDense': {
			fontSize: theme.typography.fontSize
		}
	},
	itemDisplayName: {
		color: 'white',
		fontSize: '.8em',
		fontWeight: 300
	},
	itemEmailAddress: {
		color: 'white',
		fontSize: '.6em',
		fontWeight: 300
	},
	textDense: {},
	divider: {
		marginTop: theme.spacing(2)
	}
}));


const SideNav: FunctionComponent<RouteComponentProps & DrawerProps> = ({ location, variant, PaperProps }) => {

	const classes = useStyles();

	const { stateSideNav, dispatchSideNav } = useContext(SideNavContext);
	const [stateDrawer, setStateDrawer] = useState(false);
	const [pathSelected, setPathSelected] = useState('');
	// eslint-disable-next-line 
	const [userGroup,] = useState([]);

	useEffect(() => {
		const { open } = stateSideNav;
		setStateDrawer(open);
	}, [stateSideNav]);

	useEffect(() => {
		setPathSelected(location.pathname);
	}, [location]);


	return (
		<Drawer
			variant={variant}
			PaperProps={PaperProps}
			open={stateDrawer}
			onClose={() => dispatchSideNav({ type: 'close' })}
		>
			<div
				onKeyDown={() => dispatchSideNav({ type: 'close' })}
				onClick={() => dispatchSideNav({ type: 'close' })}
			>
				<List disablePadding>
					<ListSubheader
						// key="1"
						className={classNames(
							classes.firebase,
							classes.item,
							classes.itemCategory,
							classes.backgroundImage
						)}
					>
						Halt App
          </ListSubheader>
					{navItems.map(({ id, children, group }) => {
						const matchGroup = userGroup ? userGroup.filter(g => group.includes(g)) : []
						return (group.length === 0 || matchGroup.length > 0 ?
							<React.Fragment key={id}>
								<ListItem className={classes.categoryHeader}>
									<ListItemText
										classes={{
											primary: classes.categoryHeaderPrimary
										}}
									>
										{id}
									</ListItemText>
								</ListItem>
								{children.map(({ id, icon, link, path, group }) => {

									const regPath = new RegExp(`^${path}`)
									const matchGroup = userGroup ? userGroup.filter(g => group.includes(g)) : []
									return (group.length === 0 || matchGroup.length > 0 ?


										<ListItem
											button
											component={link}
											dense
											key={id}
											selected={!!pathSelected.match(regPath)}
											className={classNames(classes.item, classes.itemActionable)}
											classes={{ selected: classes.itemActiveItem }}
										>
											<ListItemIcon>{icon}</ListItemIcon>
											<ListItemText
												classes={{
													primary: classes.itemPrimary
												}}
											>
												{id}
											</ListItemText>
										</ListItem> : null
									)
								})}
								<Divider className={classes.divider} />
							</React.Fragment> : null)
					})}
				</List>
			</div>
		</Drawer>
	);
}

export default withRouter(SideNav);
