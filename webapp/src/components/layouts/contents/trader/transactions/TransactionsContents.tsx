import React, { useContext, useEffect, useState, useRef, createContext, useReducer, Dispatch, FunctionComponent, useCallback } from 'react';
import { FirebaseContext, Firebase } from '../../../../providers/Firebase/FirebaseProvider';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router-dom'
import { AuthContext } from '../../../../containers/Main';
import TransactionsTradeboard from "./TransactionsTradeboard";


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
							component={() => {
								return (
									<div>Pending</div>
								)
							}}
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
