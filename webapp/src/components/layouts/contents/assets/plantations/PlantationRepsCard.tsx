import React, { FunctionComponent, useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { grey } from '@material-ui/core/colors';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PlantationRepsCardList from "./PlantationRepsCardList";
import { PlantationAssetContext } from '../AssetsContents';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		card: {
			minWidth: 345,
			[theme.breakpoints.down('xs')]: {
				borderRadius: 0,
				margin: "auto",
				height: "100vh",
				width: "100vw"
			},
		},
		add: {
			marginLeft: 'auto',
		},
		content: {
			backgroundColor: grey[100],
		},
		contentWrapper: {
			margin: '40px 16px',
		},
	}),
);

const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => (
	<RouterLink innerRef={ref}  {...props} />
));

type IProps = {
	match: any
}

const DetailCard: FunctionComponent<IProps> = ({ match }) => {


	const classes = useStyles();
	const { statePlantationAssetContext } = useContext(PlantationAssetContext)
	const { selectedRepProfilesState, selectedPlantationDetailState } = statePlantationAssetContext!

	return (
		<>
			<Card className={classes.card}>
				<CardHeader
					action={
						<IconButton aria-label="settings" component={Link} to={`/assets/plantations/detail/${match.params.id}`}>
							<AssignmentIcon />
						</IconButton>
					}
					title={selectedPlantationDetailState!.name!}
					subheader={"Producer Reps"}
				/>
				{
					<CardContent className={classes.content}>
						{selectedPlantationDetailState!.repIds && selectedPlantationDetailState!.repIds!.length > 0 ?

							<PlantationRepsCardList
								plantationSummary={selectedPlantationDetailState!}
								repProfiles={selectedRepProfilesState!}
							/>
							:
							<div className={classes.contentWrapper}>
								<Typography color="textSecondary" align="center">
									No plantations reps registered yet
						</Typography>
							</div>
						}

					</CardContent>
				}

			</Card>

		</>
	);
}

export default DetailCard;