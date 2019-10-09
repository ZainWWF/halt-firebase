import React, { useContext } from 'react';
import MaterialTable from 'material-table';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';



const defaultTheme = createMuiTheme();
defaultTheme.shadows[2] = defaultTheme.shadows[0]

type Props ={
	plantations: any

}

export default function FC(props: Props) {
	const {plantations } = props;

	const [state, setState] = React.useState<any>(
		({
			columns: [
				{ title: 'Origin', field: 'origin' ,   lookup: plantations},
				{ title: 'Amount', field: 'amount', type: 'numeric' },

			],
			data: [
			],
		}));


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
					showEmptyDataSourceMessage: false

				}}
				// components={{ Pagination: props => null }}
				editable={{
					onRowAdd: newData =>
						new Promise(resolve => {
							setTimeout(() => {
								resolve();
								const data = [...state.data];
								data.push(newData);
								setState({ ...state, data });
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