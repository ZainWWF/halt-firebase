import React, {  FunctionComponent } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import TransactionsTradeboard from "./TransactionsTradeboard";
import TransactionsPendingView from "./pending/TransactionsPendingView"

type IProps = {
	match: any
}

const TransactionsContents: FunctionComponent<IProps> = ({ match }) => {


	return (
		<TransactionsTradeboard>
			{() => {
				return (
					<Switch>
						<Redirect exact from="/transactions" to={"/transactions/pending"} />
						<Route
							path="/transactions/pending"
							component={	TransactionsPendingView}
						/>
						<Route
							path="/transactions/completed"
							component={() => {
								return (
									<div>Completed</div>
								)
							}}
						/>
						<Route
							path="/transactions/rejected"
							component={() => {
								return (
									<div>Rejected</div>
								)
							}}
						/>
					</Switch>
				);
			}}

		</TransactionsTradeboard>

	)


};

export default TransactionsContents;