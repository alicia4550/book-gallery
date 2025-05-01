import React from "react";
import './App.css';
import { Table } from "react-bootstrap";
import { PieChart } from 'react-minimal-pie-chart';
import { useQuery } from "react-query";

function Statistics() {
	async function fetchStatistics() {
		const res = await fetch("/getStatistics");
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
					<PieChart style={{height: "25%", margin: "25px 0px"}}
						data={data.typeCount}
						label={({ dataEntry }) => dataEntry.title + ": " + Math.round(dataEntry.percentage) + '% (' + dataEntry.value + ")"}
						labelStyle={(index) => ({
							fill: "white",
							fontSize: '5px',
							fontFamily: 'sans-serif',
						})}
						labelPosition={60}
						onClick={(e, i) => window.location.href = i === 1 ? "/?type=Fiction" : "/?type=Nonfiction"}
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
					<PieChart style={{height: "25%", margin: "25px 0px"}}
						data={data.typeCountYTD}
						label={({ dataEntry }) => dataEntry.title + ": " + Math.round(dataEntry.percentage) + '% (' + dataEntry.value + ")"}
						labelStyle={(index) => ({
							fill: "white",
							fontSize: '5px',
							fontFamily: 'sans-serif',
						})}
						labelPosition={60}
						onClick={(e, i) => window.location.href = (i === 1 ? "/?type=Fiction" : "/?type=Nonfiction") + "&ytd=true"}
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