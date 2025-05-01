import React from "react";
import './App.css';

import Navigation from "./Navigation";
import Main from "./Main";

import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

const queryClient = new QueryClient()

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<div className='app'>
				<Navigation />
				<Main queryClient={queryClient}/>
			</div>
		</QueryClientProvider>
	);
}

export default App;