import React, { useContext } from "react";
import { ListItem, ListItemText, ListItemSecondaryAction, Button } from "@material-ui/core";
import { AuthContext } from '../../../../../containers/Main';



const getDisplayItems = (transaction: any, userId: string) => {
	if (!transaction) return null
	const {  sellerId, sellerName,  buyerName, createdAt, amount, transportationBy } = transaction
	const transactionTypeLabel = userId === sellerId ? "Requested to Sell" : "Requested to Buy";
	const dateLabel = `${createdAt.toDate().toDateString()} ${createdAt.toDate().toTimeString().split("GMT")[0]}hr`
	const amountLabel = `${amount} kg`
	const contactNameLabel = userId === sellerId ? `to ${buyerName}` : `from ${sellerName}`
	const transportationByLabel = (userId === sellerId) && (transportationBy === "Buyer") ? "" : "Select a transport"
	return {  transportationByLabel, transactionTypeLabel, dateLabel, amountLabel, contactNameLabel, ...transaction }
}


type Props = {
	transactionDetail: any
}

export default function FC(props: Props) {
	const user = useContext(AuthContext) as firebase.User;
	const { transactionDetail } = props
	const displayItems = getDisplayItems(transactionDetail, user.uid)
	return (!transactionDetail ? null :
		<>
			<ListItem  >
				<ListItemText primary={displayItems.transactionTypeLabel} secondary={displayItems.dateLabel} />
			</ListItem>
			<ListItem  >
				<ListItemText primary={displayItems.contactNameLabel} secondary={displayItems.millIs ? displayItems.millName : ""} />
			</ListItem>
			<ListItem button >
				<ListItemText primary={displayItems.amountLabel} />
			</ListItem>
			<ListItem button >
				{displayItems.vehicleId ?
					<ListItemText primary={displayItems.vehicle}
						secondary={`Transportation by ${displayItems.transportationBy}`} />
					:
					<ListItemText primary={`Transportation by ${displayItems.transportationBy}`}
					secondary={displayItems.transportationByLabel} />
				}

			</ListItem>
			<ListItem button >
				<ListItemText primary={displayItems.collectionPointIsInvalid ?
					`${displayItems.collectionPoint.longitude},${displayItems.collectionPoint.latitude}` : "No collectiont point"}
					secondary={displayItems.collectionPointIsInvalid ? "Collection Point" : "Pick a collectiont point if required "} />
			</ListItem>
			<ListItem >
				<ListItemText />
				<ListItemSecondaryAction >
					{displayItems.createdBy === user.uid ?
						<Button
							// onClick={onSubmitForm(isValid)}
							color="primary"
						// disabled={(!isValid && Boolean(touched)) || !submittedValues}
						>
							Cancel
						</Button>
						:
						<>
							<Button
								// onClick={onCloseDialog} 
								color="primary"
							>
								Reject
          		</Button>
							<Button
								// onClick={onSubmitForm(isValid)}
								color="primary"
							// disabled={(!isValid && Boolean(touched)) || !submittedValues}
							>
								Accept
          		</Button>
						</>
					}
					<ListItemText />
				</ListItemSecondaryAction>
			</ListItem>

		</>
	)
}