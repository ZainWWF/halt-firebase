import React from "react";
import { CircularProgress, Dialog, DialogTitle, DialogContent } from "@material-ui/core";

const FC = () => {
	return (
		<Dialog
			maxWidth={"sm"}
			open={true}
			aria-labelledby="wait-in-progress"
		>
			<DialogTitle >Please Wait...</DialogTitle>
			<DialogContent dividers={true}>
				<div style={{ margin: "20px 55px", padding: 20, width: "50%" }}>
					<CircularProgress />
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default FC