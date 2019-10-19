import React, { useContext, FunctionComponent, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import { Theme } from "@material-ui/core/styles";
import navItems from "../sidenav/nav-items";
import { Route, Switch } from "react-router-dom";
import { SideNavContext } from "../../providers/SideNav/SideNavProvider";
import { makeStyles } from "@material-ui/core/styles";
import { AuthContext } from "../../containers/Main";
import { Avatar, Typography } from "@material-ui/core";
import HeaderAvatarMenu from "./HeaderAvatarMenu";
import AssistanceFormModal from "./assistance/AssistanceFormModal"
import AssistanceForm from "./assistance/AssistanceForm"

const useStyles = makeStyles((theme: Theme) => ({

	menuButton: {
		marginLeft: -theme.spacing(1),
	},
	topBar: {
		minHeight: 60
	},
	iconButtonAvatar: {
		padding: 4,
	},
}));


const Header: FunctionComponent = () => {

	const classes = useStyles();
	const { dispatchSideNav } = useContext(SideNavContext);

	const user = useContext(AuthContext) as any

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [openAssistance, setOpenAssistance] = useState(false);

	const openAvatarMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const onCloseAvatarMenu = () => {
		setAnchorEl(null);
	};

	const onCloseAssistance = () => {
		setOpenAssistance(false)
	}

	return (
		<>
			<AppBar color="primary" position="sticky" elevation={0}>
				<Toolbar>
					<Grid container alignItems="center" justify="space-between">
						<Hidden smUp>
							<Grid item>
								<IconButton
									data-testid="header-button-drawer"
									color="inherit"
									aria-label="Open drawer"
									onClick={() => dispatchSideNav({ type: 'toggle' })}
									className={classes.menuButton}
								>
									<MenuIcon />
								</IconButton>
							</Grid>
						</Hidden>
						<Grid item >
						</Grid>
						<Grid item>
							<Typography variant={"caption"}>
							{user.name}
							</Typography>
							<IconButton className={classes.iconButtonAvatar} onClick={openAvatarMenu}>
								<Avatar style={{background: `#${user.name ? user.name.charCodeAt() : "01"}ff` }}  alt={""} src={user ? user!.photoUrl : ""} >
									{
										!user!.photoUrl && user.name ? user.name.slice(0, 1)[0].toUpperCase() : null
									}
								</Avatar>

							</IconButton>
							<HeaderAvatarMenu anchorEl={anchorEl} onCloseAvatarMenu={onCloseAvatarMenu} setOpenAssistance={setOpenAssistance} />
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<Switch>
				{navItems
					.reduce((acc: any[], curr) => {
						return [...acc, ...curr.children];
					}, [])
					.map(({ id, header, path }) => (
						<Route
							key={id}
							path={path}
							component={header}
						/>
					))}
			</Switch>
			<AssistanceForm openAssistance={openAssistance} onCloseAssistance={onCloseAssistance}>
				{(setAssistanceRequest) => <AssistanceFormModal setAssistanceRequest={setAssistanceRequest} />}
			</AssistanceForm>
		</>
	);
}

export default Header;