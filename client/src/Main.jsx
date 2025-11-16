import { Routes, Route } from 'react-router-dom';
import React from "react";
import './App.css';

import Gallery from './Gallery';
import Statistics from './Statistics';
import Map from './Map';

function Main(props) {
	return (
		<Routes>
			<Route exact path='/' element={<Gallery queryClient={props.queryClient} />}></Route>
			<Route exact path='/statistics' element={<Statistics />}></Route>
			<Route exact path='/map' element={<Map />}></Route>
		</Routes>
	);
}

export default Main;