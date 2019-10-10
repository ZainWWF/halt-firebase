import React, { useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import MaterialTable from 'material-table';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { FormikErrors, FormikValues } from 'formik';


const defaultTheme = createMuiTheme();
defaultTheme.shadows[2] = defaultTheme.shadows[0]

type Props = {
	plantations: any
	setAmountSource: Dispatch<SetStateAction<any>>
	amountRef: React.MutableRefObject<any>
}

export default function FC(props: Props) {
	const { plantations, setAmountSource, amountRef } = props;

	const [state, setState] = useState<any>(
		({
			columns: [
				{ title: 'Origin', field: 'origin', lookup: plantations },
				{ title: 'Amount', field: 'amount', type: 'numeric' },

			],
			data: [
			],
		}));

	useEffect(() => {
		setAmountSource(state.data)
		console.log(state.data)
		if(state.data.length != 0){
			amountRef!.current.focus()
			setTimeout(()=>amountRef!.current.blur(),1000)		
		}

	},[state.data, setAmountSource])


	return (

		<ThemeProvider
			theme={
				{
					...defaultTheme,
				}}
		>
			<MaterialTable
				title="Source"
				columns={state.columns}
				data={state.data}
				options={{
					search: false,
					filtering: false,
					pageSize: 3,
					pageSizeOptions: [3, 5, 7],
					showFirstLastPageButtons: false,
					showEmptyDataSourceMessage: false,
					actionsColumnIndex: -1

				}}
				// components={{ Pagination: props => null }}
				editable={{
					onRowAdd: (newData: any) =>
						new Promise((resolve, reject) => {
							setTimeout(() => {
								if (!newData.amount || !newData.origin || Number(newData.amount) <= 0) {
									console.log("reject")
									reject()
								} else {
									resolve();
									const data = [...state.data];
									data.push(newData);
									setState({ ...state, data });
								}
							}, 600);
						}),
					onRowUpdate: (newData, oldData) =>
						new Promise(resolve => {
							setTimeout(() => {
								resolve();
								const data = [...state.data];
								data[data.indexOf(oldData!)] = newData;
								setState({ ...state, data });
							}, 600);
						}),
					onRowDelete: oldData =>
						new Promise(resolve => {
							setTimeout(() => {
								resolve();
								const data = [...state.data];
								data.splice(data.indexOf(oldData), 1);
								setState({ ...state, data });
							}, 600);
						}),
				}}
			/>

		</ThemeProvider>

	);
}