import React from "react";
import './App.css';

import Book from "./components/Book";
import BookModal from "./components/BookModal";
import FormModal from "./components/FormModal";

function App() {
	const [books, setBooks] = React.useState(null);
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

	React.useEffect(() => {
		fetch("/getBooks")
		.then((res) => res.json())
		.then((data) => {
			setBooks(data.message);
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
	
			let book = books[currentBook.id - 1];
			if (event.key === 'ArrowLeft') {
				// left arrow
				book = books[currentBook.id > 2 ? currentBook.id - 2 : 0];
			}
			else if (event.key === 'ArrowRight') {
				// right arrow
				book = books[currentBook.id < books.length ? currentBook.id : books.length - 1];
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
	}, [showBookModal, currentBook, books]);

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

			{/* Gallery */}
			<div className="gallery">
				{!books ? "Loading..." : books.map((book, index) => {
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
