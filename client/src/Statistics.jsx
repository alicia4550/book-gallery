import React from "react";
import './App.css';
import { Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { BarChart, PieChart, pieArcLabelClasses } from "@mui/x-charts"

import baseUrl from "./baseUrl";

function Statistics() {
	async function fetchStatistics() {
		const res = await fetch(`${baseUrl}/getStatistics`);
  		return res.json();
	}

	const { data, status } = useQuery("statistics", fetchStatistics);

	return (
		<>
		{status === "error" && <p>Error fetching data</p>}
      	{status === "loading" && <p>Fetching data...</p>}
      	{status === "success" && (
		<div className='statistics'>
			<div className="row">
				<div className="col" style={{textAlign: "center"}}>
					<h1>Total Books Read:</h1>
					<a href="/" className="stat-text">{data.totalBooksRead}</a>
					<h1>Total Pages Read:</h1>
					<a href="/" className="stat-text">{data.totalPagesRead}</a>
					<h1>Ratings:</h1>
					<BarChart 
						dataset={data.ratingsCount}
						xAxis={[{ dataKey: "rating", valueFormatter: (rating) => ('★'.repeat(rating)) }]}
						series={[{ dataKey: "count", valueFormatter: (count) => (count + " books") }]}
						height={300}
					/>
					<h1>Top Authors:</h1>
					<Table>
						<thead>
							<tr>
								<th><p>Author</p></th>
								<th><p>Number of Books Read</p></th>
							</tr>
						</thead>
						<tbody>
						{ data.topAuthors.length === 0 ? <tr><td colSpan={2}><p className="stat-text">No data available</p></td></tr> : data.topAuthors.slice(0,5).map((author, index) => {
							return (
								<tr key={index}>
									<td>
										<a href={"/?searchTerm=" + author.author}>{author.author}</a>
									</td>
									<td>
										<p>{author.count}</p>
									</td>
								</tr>
							)
						})}
						</tbody>
					</Table>
					<h1>Fiction vs Nonfiction:</h1>
					{ data.typeCount.length === 0 ? <p className="stat-text">No data available</p> :
					<PieChart
						series={[
							{
								arcLabel: (item) => `${Math.round(item.value/data.totalBooksRead*100)}%`,
								data: data.typeCount,
								valueFormatter: (item) => (item.value + " books")
							},
						]}
						sx={{
							[`& .${pieArcLabelClasses.root}`]: {
								fontWeight: 'bold',
								fill: 'white',
								fontSize: 'medium'
							},
						}}
						slotProps={{
							legend: {
								sx: {
									fontSize: 'medium',
								},
								direction: 'horizontal',
								position: { 
									vertical: 'bottom',
									horizontal: 'center'
								}
							},
						}}
						width={250}
						height={250}
						onItemClick={(event, d) => window.location.href = (d.dataIndex === 1 ? "/?type=Fiction" : "/?type=Nonfiction")}
					/>
					}
					<h1>Top Genres:</h1>
					<Table>
						<thead>
							<tr>
								<th><p>Genre</p></th>
								<th><p>Number of Books Read</p></th>
							</tr>
						</thead>
						<tbody>
						{ data.topGenresYTD.length === 0 ? <tr><td colSpan={2}><p className="stat-text">No data available</p></td></tr> : data.topGenres.slice(0,5).map((genre, index) => {
							return (
								<tr key={index}>
									<td>
										<a href={"/?genre=" + genre.genre.replace("&", "%26")}>{genre.genre}</a>
									</td>
									<td>
										<p>{genre.count}</p>
									</td>
								</tr>
							)
						})}
						</tbody>
					</Table>
				</div>
				<div className="col" style={{textAlign: "center"}}>
					<h1>Total Books Read (YTD):</h1>
					<a href="/?ytd=true" className="stat-text">{data.totalBooksReadYTD}</a>
					<h1>Total Pages Read (YTD):</h1>
					<a href="/?ytd=true" className="stat-text">{data.totalPagesReadYTD}</a>
					<h1>Ratings (YTD):</h1>
					<BarChart 
						dataset={data.ratingsCountYTD}
						xAxis={[{ dataKey: "rating", valueFormatter: (rating) => ('★'.repeat(rating)) }]}
						series={[{ dataKey: "count", valueFormatter: (count) => (count + " books") }]}
						height={300}
					/>
					<h1>Top Authors (YTD):</h1>
					<Table>
						<thead>
							<tr>
								<th><p>Author</p></th>
								<th><p>Number of Books Read</p></th>
							</tr>
						</thead>
						<tbody>
						{ data.topAuthorsYTD.length === 0 ? <tr><td colSpan={2}><p className="stat-text">No data available</p></td></tr> : data.topAuthorsYTD.slice(0,5).map((author, index) => {
							return (
								<tr key={index}>
									<td>
									<a href={"/?searchTerm=" + author.author + "&ytd=true"}>{author.author}</a>
									</td>
									<td>
										<p>{author.count}</p>
									</td>
								</tr>
							)
						})}
						</tbody>
					</Table>
					<h1>Fiction vs Nonfiction (YTD):</h1>
					{ data.typeCountYTD.length === 0 ? <p className="stat-text">No data available</p> :
					<PieChart
						series={[
							{
								arcLabel: (item) => `${Math.round(item.value/data.totalBooksReadYTD*100)}%`,
								data: data.typeCountYTD,
								valueFormatter: (item) => (item.value + " books")
							},
						]}
						sx={{
							[`& .${pieArcLabelClasses.root}`]: {
								fontWeight: 'bold',
								fill: 'white',
								fontSize: 'medium'
							},
						}}
						slotProps={{
							legend: {
								sx: {
									fontSize: 'medium',
								},
								direction: 'horizontal',
								position: { 
									vertical: 'bottom',
									horizontal: 'center'
								}
							},
						}}
						width={250}
						height={250}
						onItemClick={(event, d) => window.location.href = (d.dataIndex === 1 ? "/?type=Fiction" : "/?type=Nonfiction") + "&ytd=true"}
					/>
					}
					<h1>Top Genres (YTD):</h1>
					<Table>
						<thead>
							<tr>
								<th><p>Genre</p></th>
								<th><p>Number of Books Read</p></th>
							</tr>
						</thead>
						<tbody>
						{ data.topGenresYTD.length === 0 ? <tr><td colSpan={2}><p className="stat-text">No data available</p></td></tr> : data.topGenresYTD.slice(0,5).map((genre, index) => {
							return (
								<tr key={index}>
									<td>
									<a href={"/?genre=" + genre.genre.replace("&", "%26") + "&ytd=true"}>{genre.genre}</a>
									</td>
									<td>
										<p>{genre.count}</p>
									</td>
								</tr>
							)
						})}
						</tbody>
					</Table>
				</div>
			</div>
		</div>
		)}
		</>
	);
}

export default Statistics;