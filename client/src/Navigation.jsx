import { NavLink } from 'react-router-dom';
import React from "react";
import './App.css';

function Navigation() {
	return (
		<nav>
			<ul>
				<li><NavLink exact="true" to='/'>Gallery</NavLink></li>
				<li><NavLink exact="true" to='/statistics'>Statistics</NavLink></li>
			</ul>
		</nav>
	);
}

export default Navigation;