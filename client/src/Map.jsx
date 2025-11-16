import React from "react";
import { useLayoutEffect } from 'react';
import { useQueries } from "react-query";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_canadaHigh from "@amcharts/amcharts5-geodata/canadaHigh";
import am5geodata_worldHigh from "@amcharts/amcharts5-geodata/worldHigh";

import Book from "./components/Book";
import BookModal from "./components/BookModal";

import baseUrl from "./baseUrl";

import './App.css';

function Map() {
	const [provinceId, setProvinceId] = React.useState("CA");
	const [provinceName, setProvinceName] = React.useState("Canada");
	const [booksInProvince, setBooksInProvince] = React.useState([]);
	const [booksInCanada, setBooksInCanada] = React.useState(null);
	const [currentBook, setCurrentBook] = React.useState(null);
	const [showBookModal, setShowBookModal] = React.useState(false);

	const [touchStart, setTouchStart] = React.useState(null);
	const [touchEnd, setTouchEnd] = React.useState(null);

	function openModal(id) {
		let i = booksInProvince.findIndex(book => book.id === id);
		let book = booksInProvince[i];
		setCurrentBook({
			id : id,
			title : book.title,
			author : book.author,
			description : book.description,
			imageUrl : book.imageurl,
			date : book.date,
			type : book.type,
			genres : book.genres,
			pageCount : book.pageCount
		});
		setShowBookModal(true);
	}

	function closeBookModal() {
		setShowBookModal(false);
	}

	async function fetchBooksInCanada() {
		const res = await fetch(`${baseUrl}/getBooksSetInCanada`);
		return res.json();
	}

	const cache = useQueries([
		{
			queryKey: "booksInCanada",
			queryFn: fetchBooksInCanada
		}
	]);

	if (cache[0].status === "success" && booksInCanada === null) {
		setBooksInCanada(cache[0].data.message);
	}

	// the required distance between touchStart and touchEnd to be detected as a swipe
	const minSwipeDistance = 50;

	const onTouchStart = (e) => {
		setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
		setTouchStart(e.targetTouches[0].clientX);
	}

	const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) return;
		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;
		if (isLeftSwipe) {
			changeBook('next');
		} else if (isRightSwipe) {
			changeBook('previous');
		}
	}

	function changeBook(direction) {
		let i = booksInProvince.findIndex(book => book.id === currentBook.id);

		let book = booksInProvince[i];
		if (direction === 'previous') {
			// left arrow
			book = booksInProvince[i > 1 ? i - 1 : 0];
		}
		else if (direction === 'next') {
			// right arrow
			book = booksInProvince[i < booksInProvince.length - 1 ? i + 1 : booksInProvince.length - 1];
		}
		
		setCurrentBook({
			id : book.id,
			title : book.title,
			author : book.author,
			description : book.description,
			imageUrl : book.imageurl,
			date : book.date,
			type : book.type,
			genres : book.genres,
			pageCount : book.pageCount
		});
	}

	React.useEffect(() => {
		function detectClick(event) {
			if (!showBookModal) return;

			if (event.key === 'ArrowLeft') {
				changeBook('previous');
			}
			else if (event.key === 'ArrowRight') {
				changeBook('next');
			}
		}
		
		document.addEventListener('keydown', detectClick);
	
		return function cleanup() {
			document.removeEventListener('keydown', detectClick);
		}
	}, [showBookModal, currentBook, booksInProvince]);

	React.useEffect(()=> {
		if (booksInCanada === null) return;
		switch(provinceId) {
			case "CA-YT":
				setProvinceName("Yukon");
				setBooksInProvince(booksInCanada.filter((book) => book.province === provinceId));
				break;
			case "CA-NT":
				setProvinceName("Northwest Territories");
				setBooksInProvince(booksInCanada.filter((book) => book.province === provinceId));
				break;
			case "CA-NU":
				setProvinceName("Nunavut");
				setBooksInProvince(booksInCanada.filter((book) => book.province === provinceId));
				break;
			case "CA-BC":
				setProvinceName("British Colombia");
				setBooksInProvince(booksInCanada.filter((book) => book.province === provinceId));
				break;
			case "CA-AB":
				setProvinceName("Alberta");
				setBooksInProvince(booksInCanada.filter((book) => book.province === provinceId));
				break;
			case "CA-SK":
				setProvinceName("Saskatchewan");
				setBooksInProvince(booksInCanada.filter((book) => book.province === provinceId));
				break;
			case "CA-MB":
				setProvinceName("Manitoba");
				setBooksInProvince(booksInCanada.filter((book) => book.province === provinceId));
				break;
			case "CA-ON":
				setProvinceName("Ontario");
				setBooksInProvince(booksInCanada.filter((book) => book.province === provinceId));
				break;
			case "CA-QC":
				setProvinceName("Quebec");
				setBooksInProvince(booksInCanada.filter((book) => book.province === provinceId));
				break;
			case "CA-NL":
				setProvinceName("Newfoundland and Labrador");
				setBooksInProvince(booksInCanada.filter((book) => book.province === provinceId));
				break;
			case "CA-NB":
				setProvinceName("New Brunswick");
				setBooksInProvince(booksInCanada.filter((book) => book.province === provinceId));
				break;
			case "CA-NS":
				setProvinceName("Nova Scotia");
				setBooksInProvince(booksInCanada.filter((book) => book.province === provinceId));
				break;
			case "CA-PE":
				setProvinceName("Prince Edward Island");
				setBooksInProvince(booksInCanada.filter((book) => book.province === provinceId));
				break;
			default:
				setProvinceName("Canada");
				setBooksInProvince(booksInCanada.filter((book) => book.province === provinceId));
				break;
		}
	}, [booksInCanada, provinceId]);

	useLayoutEffect(() => {
		if (booksInCanada === null) return;

		let root = am5.Root.new("chartdiv");

		var chart = root.container.children.push(
			am5map.MapChart.new(root, {
				projection: am5map.geoMercator()
			})
		);

		var polygonSeries = chart.series.push(
			am5map.MapPolygonSeries.new(root, {
				geoJSON: am5geodata_canadaHigh,
				valueField: "value",
    			calculateAggregates: true,
				stroke: am5.color(0x095256)
			})
		);

		chart.chartContainer.set("background", am5.Rectangle.new(root, {
			fill: am5.color(0xd4f1f9),
			fillOpacity: 1
		}));

		polygonSeries.mapPolygons.template.setAll({
			tooltipText: "{name}: {value}",
			templateField: "polygonSettings"
		});

		// polygonSeries.mapPolygons.template.states.create("hover", {
		// 	fill: am5.color(0x677935)
		// });

		polygonSeries.mapPolygons.template.events.on("click", function(ev) {
			setProvinceId(ev.target.dataItem.get("id"));
		});

		polygonSeries.set("heatRules", [{
			target: polygonSeries.mapPolygons.template,
			dataField: "value",
			min: am5.color(0xAFFAA0),
			max: am5.color(0x3B6433),
			key: "fill"
		}]);

		polygonSeries.data.setAll([{
			id: "CA-YT",
			value: booksInCanada.filter((book) => book.province === "CA-YT").length
		}, {
			id: "CA-NT",
			value: booksInCanada.filter((book) => book.province === "CA-NT").length
		}, {
			id: "CA-NU",
			value: booksInCanada.filter((book) => book.province === "CA-NU").length
		}, {
			id: "CA-BC",
			value: booksInCanada.filter((book) => book.province === "CA-BC").length
		}, {
			id: "CA-AB",
			value: booksInCanada.filter((book) => book.province === "CA-AB").length
		}, {
			id: "CA-SK",
			value: booksInCanada.filter((book) => book.province === "CA-SK").length
		}, {
			id: "CA-MB",
			value: booksInCanada.filter((book) => book.province === "CA-MB").length
		}, {
			id: "CA-ON",
			value: booksInCanada.filter((book) => book.province === "CA-ON").length
		}, {
			id: "CA-QC",
			value: booksInCanada.filter((book) => book.province === "CA-QC").length
		}, {
			id: "CA-NL",
			value: booksInCanada.filter((book) => book.province === "CA-NL").length
		}, {
			id: "CA-NB",
			value: booksInCanada.filter((book) => book.province === "CA-NB").length
		}, {
			id: "CA-NS",
			value: booksInCanada.filter((book) => book.province === "CA-NS").length
		}, {
			id: "CA-PE",
			value: booksInCanada.filter((book) => book.province === "CA-PE").length
		} ]);

		return () => {
			root.dispose();
		};
	}, [booksInCanada]);

	useLayoutEffect(() => {
		let root = am5.Root.new("world-chartdiv");

		var chart = root.container.children.push(
			am5map.MapChart.new(root, {
				projection: am5map.geoNaturalEarth1()
			})
		);

		var polygonSeries = chart.series.push(
			am5map.MapPolygonSeries.new(root, {
				geoJSON: am5geodata_worldHigh,
				valueField: "value",
    			calculateAggregates: true,
				stroke: am5.color(0x095256),
				fill: am5.color(0xAFFAA0)
			})
		);

		chart.chartContainer.set("background", am5.Rectangle.new(root, {
			fill: am5.color(0xd4f1f9),
			fillOpacity: 1
		}));

		polygonSeries.mapPolygons.template.setAll({
			tooltipText: "{name}: {value}",
			templateField: "polygonSettings"
		});

		polygonSeries.mapPolygons.template.states.create("hover", {
			fill: am5.color(0x3B6433)
		});

		polygonSeries.data.setAll([{
			id: "CA",
			value: "Sideways: The City Google Couldn't Buy - Josh O'Kane",
			polygonSettings: {
				fill: am5.color(0x57C785)
			}
		}, {
			id: "US",
			value: "The Shining - Stephen King",
			polygonSettings: {
				fill: am5.color(0x57C785)
			}
		}, {
			id: "JP",
			value: "The Devotion of Suspect X - Keigo Higashino",
			polygonSettings: {
				fill: am5.color(0x57C785)
			}
		}, {
			id: "GB",
			value: "And Then There Were None - Agatha Christie",
			polygonSettings: {
				fill: am5.color(0x57C785)
			}
		}, {
			id: "RU",
			value: "We - Yevgeny Zamyatin",
			polygonSettings: {
				fill: am5.color(0x57C785)
			}
		}, {
			id: "AR",
			value: "The Tunnel - Ernesto Sabato",
			polygonSettings: {
				fill: am5.color(0x57C785)
			}
		}, {
			id: "FR",
			value: "She Who Was No More - Pierre Boileau and Thomas Narcejac",
			polygonSettings: {
				fill: am5.color(0x57C785)
			}
		}, {
			id: "ZA",
			value: "Born a Crime - Trevor Noah",
			polygonSettings: {
				fill: am5.color(0x57C785)
			}
		}, {
			id: "PH",
			value: "Some People Need Killing - Patricia Evangelista",
			polygonSettings: {
				fill: am5.color(0x57C785)
			}
		},]);

		return () => {
			root.dispose();
		};
	}, []);

	return (
		<>
		<div className="row">
			<div className="col" id="world-chart-container">
				<div id="world-chartdiv"></div>
			</div>
		</div>
		<div className="row">
			<div className="col" id="chart-container">
				<div id="chartdiv"></div>
				<button className="form-control" id="chart-resetBtn" onClick={()=>setProvinceId("CA")}>Reset to Canada</button>
			</div>
			<div className="col">
				<h2>{provinceName}</h2>
				{booksInCanada !== null && booksInProvince.map((book, index) => {
					return (
						<Book
							key={book.id}
							id={book.id}
							title={book.title}
							imageUrl={book.imageurl}
							handleClick={openModal}
						/>
					)
				})}
				{booksInProvince.length === 0 && 
				<p>No books found</p>
				}
			</div>
			{/* Book Modal */}
			{currentBook && <BookModal
				showModal={showBookModal}
				id={currentBook.id}
				title={currentBook.title}
				author={currentBook.author}
				description={currentBook.description}
				imageUrl={currentBook.imageUrl}
				pageCount={currentBook.pageCount}
				genres={currentBook.genres}
				closeModal={closeBookModal}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
			/>}
		</div>
		</>
	);
}
export default Map;