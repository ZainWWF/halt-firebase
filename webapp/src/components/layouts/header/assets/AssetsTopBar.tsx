import React from "react";
import { Typography, Grid, AppBar } from "@material-ui/core";
import AssetsNavTabs from "./AssetsNavTabs";
import { makeStyles } from "@material-ui/core/styles";



const useStyle = makeStyles({
	root: {
		flexGrow: 1,
		width: "100%",
		color: "#fff",
		backgroundColor: "#009be5"
	},	
  label: {
    fontSize: ".8em",
    fontWeight: 400
  },
  value: {
    fontSize: "1.45em",
    fontWeight: 400,
    width: 100
  },
	title: {
		fontSize: "2em",
		lineHeight: 1,
		marginLeft: "18px",
		fontWeight: 300,
		letterSpacing: "-0.01562em"
	},
});


const  TopBar = () => {



	const classes = useStyle();
  return (
		<Grid container direction="column" justify="space-between">
			<div className={classes.root}>
				<Grid container justify="space-between">
					<Grid item>
						<Typography className={classes.title} color="inherit">
							Assets
						</Typography>
					</Grid>
					<Grid item>
					</Grid>
					<Grid item>
					</Grid>
				</Grid>
				<AppBar
					component="div"
					color="primary"
					position="static"
					elevation={0}
				>
					<AssetsNavTabs />
				</AppBar>
			</div>		
		</Grid>
  )
}


export default TopBar;
