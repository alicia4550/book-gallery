import React from "react";
import './App.css';

import Book from "./components/Book";
import BookModal from "./components/BookModal";
import FormModal from "./components/FormModal";

function App() {
	const [books, setBooks] = React.useState(null);
	const [filteredBooks, setFilteredBooks] = React.useState(null);
	const [showBookModal, setShowBookModal] = React.useState(false);
	const [showFormModal, setShowFormModal] = React.useState(false);
	const [currentBook, setCurrentBook] = React.useState({
		id : 1,
		title : "The Power of Habit: Why We Do What We Do in Life and Business",
		author : "Charles Duhigg",
		description : "",
		imageUrl : "1 The Power of Habit.jpg"
	});

	function openModal(id) {
		let book = books[id - 1];
		setCurrentBook({
			id : id,
			title : book.title,
			author : book.author,
			description : book.description,
			imageUrl : book.imageurl
		});
		setShowBookModal(true);
	}

	function closeBookModal() {
		setShowBookModal(false);
	}

		function openFormModal() {
		setShowFormModal(true);
	}

	function closeFormModal() {
		setShowFormModal(false);
	}

	function filterBooks(e) {
		let search = e.target.value.toLowerCase();

		const filtered = books.filter(book => book.title.toLowerCase().includes(search) || book.author.toLowerCase().includes(search));
		setFilteredBooks(filtered);
	}

	React.useEffect(() => {
		fetch("/getBooks")
		.then((res) => res.json())
		.then((data) => {
			setBooks(data.message);
			setFilteredBooks(data.message);
			let book = data.message[0];
			setCurrentBook({
				id : book.id,
				title : book.title,
				author : book.author,
				description : book.description,
				imageUrl : book.imageurl
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
				imageUrl : book.imageurl
			});
		}
		
		document.addEventListener('keydown', changeBook);
	
		return function cleanup() {
			document.removeEventListener('keydown', changeBook);
		}
	}, [showBookModal, currentBook, filteredBooks]);

	return (
		<div className="App">
			<div className="text-center">
				<button className="btn btn-primary btn-lg" onClick={()=>openFormModal()}>Add New Book</button>
			</div>

			{/* Add Book Modal */}
			<FormModal
				showModal={showFormModal}
				id={!books ? 0 : books.length}
				openModal={openFormModal}
				closeModal={closeFormModal}
			/> 

			<input id="searchBar" className="form-control" placeholder="Search..." onInput={(e)=>filterBooks(e)}/>

			{/* Gallery */}
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
			</div>	

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
