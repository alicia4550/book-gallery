import React from "react";

import {Form} from "react-bootstrap";

import Select from 'react-select'
import { DatePicker } from 'rsuite';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTh, faList, faSave} from "@fortawesome/free-solid-svg-icons"

import baseUrl from "../baseUrl";

import ViewButton from "./ViewButton";

export default function FilterForm(props) {
	function downloadData() {
		fetch(`${baseUrl}/download`)
		.then((res) => res.blob())
		.then((blob) => {
			const url = window.URL.createObjectURL(new Blob([blob]));
			const link = document.createElement("a");
			link.href = url;
			link.download = "books.xlsx";
			document.body.appendChild(link);
	
			link.click();
	
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		});
	}

	return (
		<>
			<div id="viewsContainer">
				<div id="views">
					<ViewButton 
						id={0}
						view={props.view}
						setView={props.setView}
						icon={faTh}
					/>
					<ViewButton 
						id={1}
						view={props.view}
						setView={props.setView}
						icon={faList}
					/>
				</div>
			</div>
			<Form.Label htmlFor="sort">Sort by:</Form.Label>
			<Form.Select size="lg" className="form-input" id="sort" name="sort" defaultValue={2} onInput={(e)=>props.sortBooks(e.target.value)}>
				<option value={1}>Date Read (Oldest to Newest)</option>
				<option value={2}>Date Read (Newest to Oldest)</option>
				<option value={3}>Author, First Name (A - Z)</option>
				<option value={4}>Author, First Name (Z - A)</option>
				<option value={5}>Author, Last Name (A - Z)</option>
				<option value={6}>Author, Last Name (Z - A)</option>
				<option value={7}>Title (A - Z)</option>
				<option value={8}>Title (Z - A)</option>
			</Form.Select>
			<Form.Label htmlFor="searchBar">Search:</Form.Label>
			<Form.Control
				size="lg" type="text" placeholder="Search..."
				className="form-input" id="searchBar"
				onInput={(e)=>props.filterBooks(e.target.value.toLowerCase(), props.filterDateFrom, props.filterDateTo, props.filterType, props.filterGenres)}
			/>
			<Form.Label htmlFor="dateFrom">Date from:</Form.Label>
			<DatePicker id="dateFrom" className="datepicker" size="lg" value={props.filterDateFrom} format="dd/MM/yyyy" onChange={(date)=>props.filterBooks(props.searchTerm, date, props.filterDateTo, props.filterType, props.filterGenres)} />
			<Form.Label htmlFor="dateTo">Date to:</Form.Label>
			<DatePicker id="dateTo" className="datepicker" size="lg" value={props.filterDateTo} format="dd/MM/yyyy" onChange={(date)=>props.filterBooks(props.searchTerm, props.filterDateFrom, date, props.filterType, props.filterGenres)} />
			<Form.Label htmlFor="filterType">Type:</Form.Label>
				<Form.Select size="lg" className="form-input" id="filterType" name="filterType" defaultValue={props.searchParams.get("type") === null ? 1 : props.searchParams.get("type") === "Fiction" ? 2 : 3} onChange={(e)=>props.filterBooks(props.searchTerm, props.filterDateFrom, props.filterDateTo, e.target.value, props.filterGenres)}>
				<option value={1}>All</option>
				<option value={2}>Fiction</option>
				<option value={3}>Nonfiction</option>
			</Form.Select>
			<Form.Label htmlFor="filterGenre">Genre(s):</Form.Label>
			<Select options={props.genres} value={props.defaultGenres} isMulti="true" menuPlacement="auto" minMenuHeight={300} className="form-input" id="filterGenre" name="filterGenre" onChange={(selectedOptions) => props.filterBooksByGenres(selectedOptions)} aria-label="Genre(s)"/>
			<button id="exportBtn" className="form-control" onClick={downloadData}><FontAwesomeIcon icon={faSave}/> Export data as Excel</button>
		</>
	);
}