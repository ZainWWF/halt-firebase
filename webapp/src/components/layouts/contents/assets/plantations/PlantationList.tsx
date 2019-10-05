
import React, { FunctionComponent, memo, useContext, useEffect,useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { grey, green } from '@material-ui/core/colors';
import classNames from "classnames";
import { PlantationAssetContext } from '../AssetsContents';
import { Typography } from '@material-ui/core';
import { PlantationSummary } from '../../../../types/Plantation';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';


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


const LinkDetails = React.forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => (
	<RouterLink innerRef={ref}  {...props} />
));


const ListView: FunctionComponent = memo(() => {

	const classes = useStyles();

	const { statePlantationAssetContext} = useContext(PlantationAssetContext)
	const { plantationCollectionState } = statePlantationAssetContext!
	const [ sortedPlantationList, setSortedPlantationList] = useState()

	const ownership = (plantation: PlantationSummary) => {
		if (!plantation.repOfId) {
			return plantation.management.type === "Pribadi" ? "owned by Me" : `owned by ${plantation.management.name}`
		} else {
			return plantation.management.type === "Pribadi" ? `owned by ${plantation.repOfName ? plantation.repOfName : "Unknown"}` : `owned by ${plantation.management.name}`
		}
	}

	useEffect(()=>{
		const sortedP = Object.keys(plantationCollectionState).reduce((sortedPlantation:{[k: string]: any}[] , plantationId:string)=>{		
			if(sortedPlantation.length === 0){
			 return [...sortedPlantation,	{ ...plantationCollectionState[plantationId], id: plantationId}]
			}	
				let i;
				for( i=sortedPlantation.length ; i >= 0; i--){
					if(sortedPlantation[i-1] && (plantationCollectionState[plantationId].sortDate <  sortedPlantation[i-1].sortDate)){
						sortedPlantation.splice(i,0,{ ...plantationCollectionState[plantationId], id: plantationId})
						break;
					}
					if(i===0){
						sortedPlantation.splice(0,0,{ ...plantationCollectionState[plantationId], id: plantationId})
					}
				}
				return [...sortedPlantation]
	
		},[])
		setSortedPlantationList(sortedP)
	},[plantationCollectionState])




	return (
		<List className={classes.root}>
			{sortedPlantationList && sortedPlantationList.length > 0 ?
				sortedPlantationList.map((plantation: any) => {
					return (
						<ListItem button component={LinkDetails} to={`/assets/plantations/detail/${plantation.id}`} key={plantation.id} id={plantation.id} >
							<ListItemAvatar>
								<Avatar alt={plantation.name} className={plantation.auditAcceptedAt ? classNames(classes.bigAvatar, classes.auditedAvatar) : classNames(classes.bigAvatar, classes.nonAuditedAvatar)} >
									{plantation.auditAcceptedAt ? <AssignmentTurnedInIcon /> : <AssignmentLateIcon />}
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary={plantation.name} secondary={ownership(plantation)} />
						</ListItem>
					)
				}) :
				<div className={classes.contentWrapper}>
					<Typography color="textSecondary" align="center">
						No plantations registered yet
				</Typography>
				</div>
			}
		</List>
	);

})

export default ListView;