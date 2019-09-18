import React, { useContext, FunctionComponent } from "react";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles";
import navItems from "../sidenav/nav-items";
import { Route, Switch } from "react-router-dom";
import { SideNavContext } from "../../providers/SideNav/SideNavProvider";
import { makeStyles } from "@material-ui/core/styles";
import { AuthContext } from  "../../containers/Main";

const useStyles = makeStyles((theme: Theme) => ({

	menuButton: {
		marginLeft: -theme.spacing(1),
	},
	topBar: {
		minHeight: 60
	}
}));

const Header: FunctionComponent = () => {

	const classes = useStyles();
	const { dispatchSideNav } = useContext(SideNavContext);
	const user = useContext(AuthContext) as firebase.User;

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
							<Typography color="inherit" variant="subtitle1">
									{user.phoneNumber}
							</Typography>
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
		</>
	);
}

export default Header;