import React from "react";
import './App.css';

import {Card, Collapse, Form, Table} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTh, faList, faAnglesRight, faAnglesLeft} from "@fortawesome/free-solid-svg-icons"
import Select from 'react-select'

import Book from "./components/Book";
import BookModal from "./components/BookModal";
import NewBookForm from "./components/NewBookForm";
import BookListRow from "./components/BookListRow";
import ViewButton from "./components/ViewButton";

function Gallery() {
	const [books, setBooks] = React.useState(null);
	const [filteredBooks, setFilteredBooks] = React.useState(null);
	const [showBookModal, setShowBookModal] = React.useState(false);
	const [currentBook, setCurrentBook] = React.useState({
		id : 1,
		title : "The Power of Habit: Why We Do What We Do in Life and Business",
		author : "Charles Duhigg",
		description : "",
		imageUrl : "1 The Power of Habit.jpg",
		date : "2024-01-01",
		type : "Nonfiction",
		genres : [],
		pageCount : 0
	});
	const [sortOrder, setSortOrder] = React.useState("2");
	const [searchTerm, setSearchTerm] = React.useState("");
	const [filterType, setFilterType] = React.useState("1");
	const [filterGenres, setFilterGenres] = React.useState([]);
	const [genres, setGenres] = React.useState([]);
	const [view, setView] = React.useState(0);
	const [openSidebar, setOpenSidebar] = React.useState(true);

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
			genres : book.genres.split(" / "),
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

	function filterBooks(search, type, genres) {
		setSearchTerm(search);
		setFilterType(type);
		let filtered = books.filter(book => book.title.toLowerCase().includes(search) || book.author.toLowerCase().includes(search));

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
		let genres = selectedOptions.map((option) => {
			return option.value;
		});
		setFilterGenres(genres);
		filterBooks(searchTerm, filterType, genres);
	}

	React.useEffect(() => {
		fetch("/getBooks")
		.then((res) => res.json())
		.then((data) => {
			setBooks(data.message);
			setFilteredBooks(data.message);
			sortBooks("2");
			let book = data.message[0];
			setCurrentBook({
				id : book.id,
				title : book.title,
				author : book.author,
				description : book.description,
				imageUrl : book.imageurl,
				date : book.date,
				type : book.type,
				genres : book.genres.split(" / "),
				pageCount : book.pageCount
			});
		});

		fetch("/getGenres")
		.then((res) => res.json())
		.then((data) => {
			let options = data.message.map((genre, index) => {
				return {value: genre, label: genre};
			});
			setGenres(options);
		})
	}, []);

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
				genres : book.genres.split(" / "),
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
			<NewBookForm id={!books ? 1 : books.length + 1}/>

			<div className="flex-container">
				<div style={{ minHeight: '150px' }}>
					<Collapse in={openSidebar} dimension="width" id="sidebar">
						<div>
							<Card body style={{ width: '400px' }}>
								<div id="viewsContainer">
									<div id="views">
										<ViewButton 
											id={0}
											view={view}
											setView={setView}
											icon={faTh}
										/>
										<ViewButton 
											id={1}
											view={view}
											setView={setView}
											icon={faList}
										/>
									</div>
								</div>
								<Form.Label htmlFor="sort">Sort by:</Form.Label>
								<Form.Select size="lg" className="form-input" id="sort" name="sort" defaultValue={2} onInput={(e)=>sortBooks(e.target.value)}>
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
									onInput={(e)=>filterBooks(e.target.value.toLowerCase(), filterType, filterGenres)}
								/>
								<Form.Label htmlFor="filterType">Type:</Form.Label>
									<Form.Select size="lg" className="form-input" id="filterType" name="filterType" defaultValue={1} onChange={(e)=>filterBooks(searchTerm, e.target.value, filterGenres)}>
									<option value={1}>All</option>
									<option value={2}>Fiction</option>
									<option value={3}>Nonfiction</option>
								</Form.Select>
								<Form.Label htmlFor="filterGenre">Genre(s):</Form.Label>
								<Select options={genres} isMulti="true" className="form-input" id="filterGenre" name="filterGenre" onChange={(selectedOptions) => filterBooksByGenres(selectedOptions)} />
							</Card>
						</div>
					</Collapse>
				</div>

				<button id="toggleSidebar" onClick={() => setOpenSidebar(!openSidebar)}>
					{openSidebar ? <FontAwesomeIcon icon={faAnglesLeft}/> : <FontAwesomeIcon icon={faAnglesRight}/>}
				</button>

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
