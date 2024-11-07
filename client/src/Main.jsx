import { Routes, Route } from 'react-router-dom';
import React from "react";
import './App.css';

import Gallery from './Gallery';
import Statistics from './Statistics';

function Main() {
	return (
		<Routes>
			<Route exact path='/' element={<Gallery />}></Route>
			<Route exact path='/statistics' element={<Statistics />}></Route>
		</Routes>
	);
}

export default Main;