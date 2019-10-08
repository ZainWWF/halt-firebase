
import React, { FunctionComponent, memo, Dispatch, SetStateAction } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
			backgroundColor: theme.palette.background.paper,
		},
	}),
);


type IProps = {
	mills: any[]
	selectMill: Dispatch<SetStateAction<any>>
}

const ListView: FunctionComponent<IProps> = memo(({ mills, selectMill }) => {

	const classes = useStyles();
	
	const onClickMill = (mill: any) => {
		selectMill(mill)
	}

	return (
		<>
			<List className={classes.root}>
				{mills && mills.length > 0 ?
					mills.map((mill: any) => {
						return (
							<ListItem button key={mill.name} onClick={() => onClickMill(mill)}>
								<ListItemText primary={mill.name} secondary={mill.group ? mill.group : ""} />
							</ListItem>
						)
					}) :
					null
				}
			</List>
		</>
	);

})

export default ListView;