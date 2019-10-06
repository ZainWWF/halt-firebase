import React, { memo, FunctionComponent, useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { TransitionProps } from '@material-ui/core/transitions';
import { Fade, makeStyles, Theme, createStyles, Card, CardHeader, CardContent } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";


const useStyles = makeStyles((theme: Theme) =>
	createStyles({

		card: {
			minWidth: 345,
			[theme.breakpoints.down('xs')]: {
				borderRadius: 0,
				margin: "auto",
				maxHeight: "100vh",
				width: "100vw"
			},
		},
		content: {
			backgroundColor: grey[100],
			overflow: "auto",
			maxHeight: 300,
			[theme.breakpoints.down('xs')]: {
				maxHeight: "100vh",
			},
		}
	}),
);

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
	return <Fade
		in={true}
		ref={ref} {...props}
		{...(true ? { timeout: 1000 } : {})} />
});



const ModalView: FunctionComponent = memo(() => {

	const classes = useStyles();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
	const [modalOpen, setModalOpen] = useState(true)

	useEffect(() => {
		let timer = setTimeout(() => {
			setModalOpen(false)
		}, 5000)

		return () => clearTimeout(timer)
	}, [])


	return (
		<>
			<Dialog fullScreen={fullScreen}
				open={modalOpen}
				TransitionComponent={Transition}
			>
				<Card className={classes.card} >
					<CardHeader
						title={"Please wait..."}
					// subheader={}
					/>
					<CardContent className={classes.content}>
					</CardContent>
				</Card>
			</Dialog>
		</>
	)
})

export default ModalView