import React from "react";
import './App.css';
import { Table } from "react-bootstrap";
import { PieChart } from 'react-minimal-pie-chart';

function Statistics() {
	const [statistics, setStatistics] = React.useState({
		totalBooksRead : 0,
		totalBooksReadYTD : 0,
		totalPagesRead : 0,
		totalPagesReadYTD : 0,
		topAuthors : [],
		topAuthorsYTD : [],
		topGenres : [],
		topGenresYTD : []
	})

	React.useEffect(() => {
		fetch("/getStatistics")
		.then((res) => res.json())
		.then((data) => {
			setStatistics(data);
		});
	}, []);

	return (
		<div className='statistics'>
			<div className="row">
				<div className="col" style={{textAlign: "center"}}>
					<h1>Total Books Read:</h1>
					<p className="stat-text">{statistics.totalBooksRead}</p>
					<h1>Total Pages Read:</h1>
					<p className="stat-text">{statistics.totalPagesRead}</p>
					<h1>Top Authors:</h1>
					<Table>
						<thead>
							<tr>
								<th><p>Author</p></th>
								<th><p>Number of Books Read</p></th>
							</tr>
						</thead>
						<tbody>
						{!statistics.topAuthors ? <p>"Loading..."</p> : 
						 statistics.topAuthors.length === 0 ? <tr><td colSpan={2}><p className="stat-text">No data available</p></td></tr> : statistics.topAuthors.slice(0,5).map((author, index) => {
							return (
								<tr key={index}>
									<td>
										<p>{author.author}</p>
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
					{!statistics.typeCount ? <p>"Loading..."</p> : 
					 statistics.typeCount.length === 0 ? <p className="stat-text">No data available</p> :
					<PieChart style={{height: "25%", margin: "25px 0px"}}
						data={statistics.typeCount}
						label={({ dataEntry }) => dataEntry.title + ": " + Math.round(dataEntry.percentage) + '% (' + dataEntry.value + ")"}
						labelStyle={(index) => ({
							fill: "white",
							fontSize: '5px',
							fontFamily: 'sans-serif',
						})}
						labelPosition={60}
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
						{!statistics.topGenres ? <p>"Loading..."</p> : 
						 statistics.topGenresYTD.length === 0 ? <tr><td colSpan={2}><p className="stat-text">No data available</p></td></tr> : statistics.topGenres.slice(0,5).map((genre, index) => {
							return (
								<tr key={index}>
									<td>
										<p>{genre.genre}</p>
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
					<p className="stat-text">{statistics.totalBooksReadYTD}</p>
					<h1>Total Pages Read (YTD):</h1>
					<p className="stat-text">{statistics.totalPagesReadYTD}</p>
					<h1>Top Authors (YTD):</h1>
					<Table>
						<thead>
							<tr>
								<th><p>Author</p></th>
								<th><p>Number of Books Read</p></th>
							</tr>
						</thead>
						<tbody>
						{!statistics.topAuthorsYTD ? <p>"Loading..."</p> : 
						 statistics.topAuthorsYTD.length === 0 ? <tr><td colSpan={2}><p className="stat-text">No data available</p></td></tr> : statistics.topAuthorsYTD.slice(0,5).map((author, index) => {
							return (
								<tr key={index}>
									<td>
										<p>{author.author}</p>
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
					{!statistics.typeCountYTD ? <p>"Loading..."</p> : 
						 statistics.typeCountYTD.length === 0 ? <p className="stat-text">No data available</p> :
					<PieChart style={{height: "25%", margin: "25px 0px"}}
						data={statistics.typeCountYTD}
						label={({ dataEntry }) => dataEntry.title + ": " + Math.round(dataEntry.percentage) + '% (' + dataEntry.value + ")"}
						labelStyle={(index) => ({
							fill: "white",
							fontSize: '5px',
							fontFamily: 'sans-serif',
						})}
						labelPosition={60}
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
						{!statistics.topGenresYTD ? <p>"Loading..."</p> : 
						 statistics.topGenresYTD.length === 0 ? <tr><td colSpan={2}><p className="stat-text">No data available</p></td></tr> : statistics.topGenresYTD.slice(0,5).map((genre, index) => {
							return (
								<tr key={index}>
									<td>
										<p>{genre.genre}</p>
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
	);
}

export default Statistics;