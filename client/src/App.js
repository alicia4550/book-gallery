import React from "react";
import './App.css';

import {Form, Table} from "react-bootstrap";
import {faTh, faList} from "@fortawesome/free-solid-svg-icons"

import Book from "./components/Book";
import BookModal from "./components/BookModal";
import NewBookForm from "./components/NewBookForm";
import BookListRow from "./components/BookListRow";
import ViewButton from "./components/ViewButton";

function App() {
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
		genres : []
	});
	const [sortOrder, setSortOrder] = React.useState("2");
	const [searchTerm, setSearchTerm] = React.useState("");
	const [filterType, setFilterType] = React.useState("1");
	const [filterGenres, setFilterGenres] = React.useState("");
	const [view, setView] = React.useState(0);

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
			genres : book.genres.split(" / ")
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

	function filterBooks(search, type) {
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

		setFilteredBooks(filtered);

		sortBooks(sortOrder);
	}

	function filterBooksByGenres(genres) {

	}

	React.useEffect(() => {
		fetch("/getBooks")
		.then((res) => res.json())
		.then((data) => {
			setBooks(data.message);
			setFilteredBooks(data.message);
			sortBooks(sortOrder);
			let book = data.message[0];
			setCurrentBook({
				id : book.id,
				title : book.title,
				author : book.author,
				description : book.description,
				imageUrl : book.imageurl,
				date : book.date,
				type : book.type,
				genres : book.genres.split(" / ")
			});
		});
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
				genres : book.genres.split(" / ")
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

			<div className="row" id="filterSort">
				<div className="col-md-6">
					<Form.Control
						size="lg" type="text" placeholder="Search..."
						id="searchBar"
						onInput={(e)=>filterBooks(e.target.value.toLowerCase(), filterType)}
					/>
				</div>
				<div className="col-md-2">
					<Form.Label id="sortLabel" htmlFor="sort">Sort by:</Form.Label>
				</div>
				<div className="col-md-3">
					<Form.Select size="lg" id="sort" name="sort" defaultValue={2} onInput={(e)=>sortBooks(e.target.value)}>
						<option value={1}>Date Read (Oldest to Newest)</option>
						<option value={2}>Date Read (Newest to Oldest)</option>
						<option value={3}>Author, First Name (A - Z)</option>
						<option value={4}>Author, First Name (Z - A)</option>
						<option value={5}>Author, Last Name (A - Z)</option>
						<option value={6}>Author, Last Name (Z - A)</option>
						<option value={7}>Title (A - Z)</option>
						<option value={8}>Title (Z - A)</option>
					</Form.Select>
				</div>
				<div className="col-md-1" id="views">
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
					{/* <button onClick={()=>setView(0)} style={{float: "left"}}><FontAwesomeIcon icon={faTh} /></button>
					<button onClick={()=>setView(1)} style={{float: "right"}}><FontAwesomeIcon icon={faList} /></button> */}
				</div>
			</div>

			{/* Genre Filter */}
			<div className="row" id="filter">
				<div className="col-md-2">
					<Form.Label>Filter:</Form.Label>
				</div>
				<div className="col-md-2">
					<Form.Label id="filterTypeLabel" htmlFor="filterType" style={{"float": "right"}}>Type:</Form.Label>
				</div>
				<div className="col-md-3">
					<Form.Select size="lg" id="filterType" name="filterType" defaultValue={1} onChange={(e)=>filterBooks(searchTerm, e.target.value)}>
						<option value={1}>All</option>
						<option value={2}>Fiction</option>
						<option value={3}>Nonfiction</option>
					</Form.Select>
				</div>
				<div className="col-md-2">
					<Form.Label id="filterGenreLabel" htmlFor="filterGenre" style={{"float": "right"}}>Genre(s):</Form.Label>
				</div>
				<div className="col-md-3">
					<Form.Select size="lg" id="filterGenre" name="filterGenre" defaultValue={1} onInput={(e)=>filterBooksByGenres(e.target.value)}>
						<option value={1}>Date Read (Oldest to Newest)</option>
						<option value={2}>Date Read (Newest to Oldest)</option>
						<option value={3}>Author, First Name (A - Z)</option>
						<option value={4}>Author, First Name (Z - A)</option>
						<option value={5}>Author, Last Name (A - Z)</option>
						<option value={6}>Author, Last Name (Z - A)</option>
						<option value={7}>Title (A - Z)</option>
						<option value={8}>Title (Z - A)</option>
					</Form.Select>
				</div>
			</div>

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

			{/* Book Modal */}
			<BookModal
				showModal={showBookModal}
				id={currentBook.id}
				title={currentBook.title}
				author={currentBook.author}
				description={currentBook.description}
				imageUrl={currentBook.imageUrl}
				closeModal={closeBookModal}
			/>
		</div>
	);
}

export default App;
