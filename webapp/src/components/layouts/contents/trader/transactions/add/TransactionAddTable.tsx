import React, {  useState, useEffect, Dispatch, SetStateAction } from 'react';
import MaterialTable from 'material-table';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

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
		if (state.data.length !== 0) {
			amountRef!.current.focus()
			setTimeout(() => amountRef!.current.blur(), 1000)
		}

	}, [state.data, setAmountSource, amountRef])


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
				editable={{
					onRowAdd: (newData: any) =>
						new Promise((resolve, reject) => {
							let timer = setTimeout(() => {
								const data = [...state.data];
								resolve();
								data.push(newData);
								setState({ ...state, data });
							}, 1000);
							// amount of origin must be greater than 0
							if (Number(newData.amount) <= 0) {
								clearTimeout(timer)
								reject()
							}
							// disallow duplicate origins
							const origins = [...state.data].map(d => d.origin)
							if (origins.includes(newData.origin)) {
								clearTimeout(timer)
								reject()
							}
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