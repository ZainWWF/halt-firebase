/**
 *  Main Page where all user auth pages are nested
 *  The routes to other pages are retrieve
 *  from config file "src/config/nav-items.config.tsx"
 */
import React, { memo, FunctionComponent } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Route, Redirect } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import SideNav from '../layouts/sidenav/SideNav';
import Header from '../layouts/header/Header';
import navItems from '../layouts/sidenav/nav-items';
import theme from '../../config/theme.config';
import { Grid } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 256;

const useStyles = makeStyles({
	root: {
		display: 'flex',
		minHeight: '100vh'
	},
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0
		}
	},
	mainContent: {
		height: "100vh",
		width: "100%",

		[theme.breakpoints.down('sm')]: {
			padding: 0,
		},
		flex: 1,
		padding: '40px',
		background: '#eaeff1'
	}
});


const  AuthPage:FunctionComponent = memo(()=> {
	const classes = useStyles();

	return (
		<MuiThemeProvider theme={theme}>
			<div className={classes.root}>
				<CssBaseline />

				<nav className={classes.drawer}>
					<Hidden smUp implementation="js">
						<SideNav
							PaperProps={{ style: { width: drawerWidth } }}
							variant="temporary"
						/>
					</Hidden>
					<Hidden xsDown implementation="css">
						<SideNav
							PaperProps={{ style: { width: drawerWidth } }}
							variant="permanent"
						/>
					</Hidden>
				</nav>
				<Grid container direction="column">
					
						<Header />
						<Redirect exact from="/" to="/assets/plantations" />			
						<main data-testid="main-content" className={classes.mainContent}>
							{navItems
								.reduce((acc: any[], curr) => {
									return [...acc, ...curr.children];
								}, [])
								.map(({ content, path, id }) => {
									return  <Route  key={id} path={path} component={content}/>
								})}
						</main>
		
				</Grid>

			</div>
		</MuiThemeProvider>
	);
});

export default AuthPage;
