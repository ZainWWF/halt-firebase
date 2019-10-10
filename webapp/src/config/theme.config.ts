import {
    createMuiTheme,
  } from "@material-ui/core/styles";

	let theme = createMuiTheme({
		typography: {
			h5: {
				fontWeight: 500,
				fontSize: 26,
				letterSpacing: 0.5,
			},
			h6: {
				fontWeight: 100,
				fontSize: "1rem",
				letterSpacing: 0.5,
			},
		},
		palette: {
			primary: {
				light: '#EDF7EB',
				main: '#384954',
				dark: '#2BAB7B',
			},
		},
		shape: {
			borderRadius: 8,
		},
	});
	
	theme = {
		...theme,
		overrides: {
			MuiDrawer: {
				paper: {
					backgroundColor: '#18202c',
				},
			},
			MuiButton: {
				label: {
					textTransform: 'none',
				},
				contained: {
					boxShadow: 'none',
					'&:active': {
						boxShadow: 'none',
					},
				},
			},
			MuiTabs: {
				root: {
					marginLeft: theme.spacing(1),
				},
				indicator: {
					height: 3,
					borderTopLeftRadius: 3,
					borderTopRightRadius: 3,
					backgroundColor: theme.palette.common.white,
				},
			},
			MuiTab: {
				root: {
					textTransform: 'none',
					margin: '0 16px',
					minWidth: 0,
					padding: 0,
					[theme.breakpoints.up('md')]: {
						padding: 0,
						minWidth: 0,
					},
				},
			},
			MuiIconButton: {
				root: {
					padding: theme.spacing(1),
				},
			},
			MuiTooltip: {
				tooltip: {
					borderRadius: 4,
				},
			},
			MuiDivider: {
				root: {
					backgroundColor: '#404854',
				},
			},
			MuiListItemText: {
				primary: {
					fontWeight: theme.typography.fontWeightMedium,
				},
			},
			MuiListItemIcon: {
				root: {
					color: 'inherit',
					marginRight: 0,
					'& svg': {
						fontSize: 20,
					},
				},
			},
			MuiAvatar: {
				root: {
					width: 32,
					height: 32,
				},
			},
		},
		props: {
			MuiTab: {
				disableRipple: true,
			},
		},
		mixins: {
			...theme.mixins,
			toolbar: {
				minHeight: 48,
			},
		},
	};
	
  export default theme;