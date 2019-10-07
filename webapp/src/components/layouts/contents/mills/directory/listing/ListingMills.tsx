
import React, { FunctionComponent, memo } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { grey, green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
			backgroundColor: theme.palette.background.paper,
		},
		bigAvatar: {
			margin: 10,
			width: 60,
			height: 60,
		},
		contentWrapper: {
			margin: '40px 16px',
		},
		auditedAvatar: {
			color: '#fff',
			backgroundColor: green[500],
		},
		nonAuditedAvatar: {
			color: '#fff',
			backgroundColor: grey[500],
		}
	}),
);

type IProps = {
	mills : any[]
}

const ListView: FunctionComponent<IProps> = memo(({mills}) => {

	const classes = useStyles();

	return (
		<List className={classes.root}>
			{  mills.length > 0 ?
				mills.map((mill: any) => {
					return (
						<ListItem  key={mill.name}  >
							<ListItemText primary={mill.name} secondary={mill.group ? mill.group : ""} />
						</ListItem>
					)
				}) :
				null
			}
		</List>
	);

})

export default ListView;