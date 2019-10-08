import React, { FunctionComponent, memo } from "react";
import {
	FormControl,	
	Checkbox,
	FormControlLabel,
} from "@material-ui/core";

interface IProps {
	onChange: any
	label: string
	state: any
	name: string
	value: string
	checked: boolean
}

const Field: FunctionComponent<IProps> = memo(({label,  ...props }) => {

	return (
		<>
			<FormControl>
				<FormControlLabel
					control={<Checkbox {...props} color="primary"/>}
					label={label}
				/>
			</FormControl>
		</>
	);
});

export default Field;


