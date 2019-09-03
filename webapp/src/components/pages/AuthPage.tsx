/**
 *  Main Page where all user auth pages are nested
 *  The routes to other pages are retrieve
 *  from config file "src/config/nav-items.config.tsx"
 */
import React, { memo } from 'react';
import {
	MuiThemeProvider,
} from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import {
	BrowserRouter as Router,
} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import SideNav from '../layouts/sidenav/SideNav';
import Header from '../layouts/header/Header';
import navItems from '../layouts/sidenav/nav-items';
import theme from '../../config/theme.config';
import { Grid } from '@material-ui/core';

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
	appContent: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column'
	},
	mainContent: {
		[theme.breakpoints.down('sm')]: {
			padding: 0,
		},
		flex: 1,
		padding: '48px 36px 0',
		background: '#eaeff1'
	}
});

const  AuthPage = memo(()=> {
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
					<Router>
						<Header />
						<main data-testid="main-content">
							{navItems
								.reduce((acc: any[], curr) => {
									return [...acc, ...curr.children];
								}, [])
								.map(({ content }) => {
									return content
								})}
						</main>
					</Router>
				</Grid>

			</div>
		</MuiThemeProvider>
	);
});

export default AuthPage;
