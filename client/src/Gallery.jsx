import React from "react";
import './App.css';

import {Card, Col, Collapse, Table} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAnglesRight, faAnglesLeft, faAnglesUp, faAnglesDown} from "@fortawesome/free-solid-svg-icons"
import { useSearchParams } from "react-router-dom";
import { useQueries } from "react-query";

import 'rsuite/DatePicker/styles/index.css';

import baseUrl from "./baseUrl";

import Book from "./components/Book";
import BookModal from "./components/BookModal";
import NewBookForm from "./components/NewBookForm";
import BookListRow from "./components/BookListRow";
import FilterForm from "./components/FilterForm";

function Gallery(props) {
	const [books, setBooks] = React.useState(null);
	const [filteredBooks, setFilteredBooks] = React.useState(null);
	const [showBookModal, setShowBookModal] = React.useState(false);
	const [currentBook, setCurrentBook] = React.useState({
		id : 1,
		title : "The Power of Habit: Why We Do What We Do in Life and Business",
		author : "Charles Duhigg",
		description : "",
		imageUrl : "1 The Power of Habit.jpg",
		date : "2022-07-15",
		type : "Nonfiction",
		genres : [],
		pageCount : 0
	});
	const [sortOrder, setSortOrder] = React.useState("2");
	const [searchTerm, setSearchTerm] = React.useState("");
	const [filterDateFrom, setFilterDateFrom] = React.useState(new Date("2022-07-15 00:00:00"));
	const [filterDateTo, setFilterDateTo] = React.useState(new Date());
	const [filterType, setFilterType] = React.useState("1");
	const [filterGenres, setFilterGenres] = React.useState([]);
	const [genres, setGenres] = React.useState([]);
	const [defaultGenres, setDefaultGenres] = React.useState([]);
	const [view, setView] = React.useState(0);
	const [openSidebar, setOpenSidebar] = React.useState(true);

	const [searchParams, setSearchParams] = useSearchParams();

	function openModal(id) {
		let book = books[id - 1];
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

	function sortBooks(order) {
		setSortOrder(order);
		switch(order) {
			case "1":
				setFilteredBooks(prevFilteredBooks => {
					return prevFilteredBooks.toSorted((a, b) => a.id < b.id ? -1 : 1)
				});
				break;
			case "2":
				setFilteredBooks(prevFilteredBooks => {
					return prevFilteredBooks.toSorted((a, b) => a.id < b.id ? 1 : -1)
				});
				break;
			case "3":
				setFilteredBooks(prevFilteredBooks => {
					return prevFilteredBooks.toSorted((a, b) => a.author.localeCompare(b.author))
				});
				break;
			case "4":
				setFilteredBooks(prevFilteredBooks => {
					return prevFilteredBooks.toSorted((a, b) => b.author.localeCompare(a.author))
				});
				break;
			case "5":
				setFilteredBooks(prevFilteredBooks => {
					return prevFilteredBooks.toSorted((a, b) => a.author.split(" ").pop().localeCompare(b.author.split(" ").pop()))
				});
				break;
			case "6":
				setFilteredBooks(prevFilteredBooks => {
					return prevFilteredBooks.toSorted((a, b) => b.author.split(" ").pop().localeCompare(a.author.split(" ").pop()))
				});
				break;
			case "7":
				setFilteredBooks(prevFilteredBooks => {
					return prevFilteredBooks.toSorted((a, b) => a.title.localeCompare(b.title))
				});
				break;
			case "8":
				setFilteredBooks(prevFilteredBooks => {
					return prevFilteredBooks.toSorted((a, b) => b.title.localeCompare(a.title))
				});
				break;
			default:
				setFilteredBooks(prevFilteredBooks => {
					return prevFilteredBooks.toSorted((a, b) => a.id < b.id ? 1 : -1)
				});
				break;
		}
	}

	function filterBooks(search, dateFrom, dateTo, type, genres) {
		if (isNaN(dateFrom) || isNaN(dateTo)) return;
		setSearchTerm(search);
		setFilterDateFrom(dateFrom);
		setFilterDateTo(dateTo);
		setFilterType(type);

		let filtered = books.filter(book => book.title.toLowerCase().includes(search) || book.author.toLowerCase().includes(search));

		if (dateFrom === null) dateFrom = new Date('2022-07-15 00:00:00');
		if (dateTo === null) dateTo = new Date();
		filtered = filtered.filter(book => new Date(book.date) >= dateFrom && new Date(book.date) <= dateTo);

		switch(type) {
			case "1":
				break;
			case "2":
				filtered = filtered.filter(book => book.type === "Fiction");;
				break;
			case "3":
				filtered = filtered.filter(book => book.type === "Nonfiction");;
				break;
			default:
				break;
		}

		if (genres.length > 0) {
			filtered = filtered.filter(book => genres.some(genre => book.genres.includes(genre)));
		}

		setFilteredBooks(filtered);

		sortBooks(sortOrder);
	}

	function filterBooksByGenres(selectedOptions) {
		setDefaultGenres(selectedOptions);
		let genres = selectedOptions.map((option) => {
			return option.value;
		});
		setFilterGenres(genres);
		filterBooks(searchTerm, filterDateFrom, filterDateTo, filterType, genres);
	}

	React.useEffect(() => {
		if (books !== null) {
			filterBooks(searchTerm, filterDateFrom, filterDateTo, filterType, filterGenres);
		}
	}, [books]);

	async function fetchBooks() {
		const res = await fetch(`${baseUrl}/getBooks`);
		return res.json();
	}

	async function fetchGenres() {
		const res = await fetch(`${baseUrl}/getGenres`);
		return res.json();
	}

	const cache = useQueries([
		{
			queryKey: "books",
			queryFn: fetchBooks
		}, {
			queryKey: "genres",
			queryFn: fetchGenres
		}
	]);

	if (cache[0].status === "success" && books === null) {
		setFilteredBooks(cache[0].data.message);
		sortBooks("2");
		let book = cache[0].data.message[0];
		setCurrentBook({
			id : book.id,
			title : book.title,
			author : book.author,
			description : book.description,
			imageUrl : book.imageurl,
			date : book.date,
			type : book.type,
			genres : book.genres,
			pageCount : book.pagecount
		});
		setBooks(cache[0].data.message);
	}
	if (cache[1].status === "success" && genres.length === 0) {
		let options = cache[1].data.message.map((genre, index) => {
			return {value: genre, label: genre};
		});
		setGenres(options);
	}

	React.useEffect(() => {
		if (searchParams.get("ytd") !== null) {
			let today = new Date();
			setFilterDateFrom(new Date(today.getFullYear()+"-01-01 00:00:00"));
		}
		if (searchParams.get("searchTerm") !== null) {
			setSearchTerm(searchParams.get("searchTerm").toLowerCase());
			document.getElementById("searchBar").value = searchParams.get("searchTerm");
		}
		if (searchParams.get("type") !== null) {
			if (searchParams.get("type") === "Fiction") {
				setFilterType("2");
			} else if (searchParams.get("type") === "Nonfiction") {
				setFilterType("3");
			}
		}
		if (searchParams.get("genre") !== null) {
			setFilterGenres([searchParams.get("genre")]);
			setDefaultGenres([{value: searchParams.get("genre"), label: searchParams.get("genre")}]);
		}
	}, [searchParams])

	React.useEffect(() => {
		function changeBook(event) {
			if (!showBookModal) return;

			let i = filteredBooks.findIndex(filteredBook => filteredBook.id === currentBook.id);
	
			let book = filteredBooks[i];
			if (event.key === 'ArrowLeft') {
				// left arrow
				book = filteredBooks[i > 1 ? i - 1 : 0];
			}
			else if (event.key === 'ArrowRight') {
				// right arrow
				book = filteredBooks[i < filteredBooks.length - 1 ? i + 1 : filteredBooks.length - 1];
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
		
		document.addEventListener('keydown', changeBook);
	
		return function cleanup() {
			document.removeEventListener('keydown', changeBook);
		}
	}, [showBookModal, currentBook, filteredBooks]);

	return (
		<div className="App">
			<NewBookForm id={!books ? 1 : books.length + 1} queryClient={props.queryClient}/>

			{window.innerWidth < 600 &&
				<div id="filterMobileContainer">
				<Collapse in={openSidebar} dimension="height" id="filterMobile">
					<div>
						<Card body>
							<FilterForm
									view={view}
									setView={setView}
									sortBooks={sortBooks}
									searchParams={searchParams}
									searchTerm={searchTerm}
									filterDateFrom={filterDateFrom}
									filterDateTo={filterDateTo}
									filterType={filterType}
									filterGenres={filterGenres}
									genres={genres}
									defaultGenres={defaultGenres}
									filterBooks={filterBooks}
									filterBooksByGenres={filterBooksByGenres}
								></FilterForm>
						</Card>
					</div>
				</Collapse>
				<button id="toggleFilters" onClick={() => setOpenSidebar(!openSidebar)} aria-label={openSidebar ? "Close filters" : "Open filters"}>
					{openSidebar ? <FontAwesomeIcon icon={faAnglesUp}/> : <FontAwesomeIcon icon={faAnglesDown}/>}
				</button>
				</div>
			}

			<div className="flex-container">
				{window.innerWidth >= 600 &&
				<>
				<div id="sidebarContainer" style={{ minHeight: '150px' }}>
					<Collapse in={openSidebar} dimension="width" id="sidebar">
						<div>
							<Card body style={{ width: '300px' }}>
								<FilterForm
									view={view}
									setView={setView}
									sortBooks={sortBooks}
									searchParams={searchParams}
									searchTerm={searchTerm}
									filterDateFrom={filterDateFrom}
									filterDateTo={filterDateTo}
									filterType={filterType}
									filterGenres={filterGenres}
									genres={genres}
									defaultGenres={defaultGenres}
									filterBooks={filterBooks}
									filterBooksByGenres={filterBooksByGenres}
								></FilterForm>
							</Card>
						</div>
					</Collapse>
				</div>

				<button id="toggleSidebar" onClick={() => setOpenSidebar(!openSidebar)} aria-label={openSidebar ? "Close sidebar" : "Open sidebar"}>
					{openSidebar ? <FontAwesomeIcon icon={faAnglesLeft}/> : <FontAwesomeIcon icon={faAnglesRight}/>}
				</button>
				</>
				}

				{/* Gallery */}
				{view === 0 ?
				<div className="gallery">
					{!filteredBooks ? <p>"Loading..."</p> : filteredBooks.map((book, index) => {
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
				</div> :
				<div className="list">
					{!filteredBooks ? <p>"Loading..."</p> : 
					<Table>
						<tbody>
							{filteredBooks.map((book, index) => {
								return (
									<BookListRow
										key={book.id}
										id={book.id}
										title={book.title}
										author={book.author}
										description={book.description}
										imageUrl={book.imageurl}
										handleClick={openModal}
									/>
								)
							})}
						</tbody>
					</Table>
					}
				</div>
				}
			</div>	

			{/* Book Modal */}
			<BookModal
				showModal={showBookModal}
				id={currentBook.id}
				title={currentBook.title}
				author={currentBook.author}
				description={currentBook.description}
				imageUrl={currentBook.imageUrl}
				pageCount={currentBook.pageCount}
				genres={currentBook.genres}
				closeModal={closeBookModal}
			/>
		</div>
	);
}

export default Gallery;
