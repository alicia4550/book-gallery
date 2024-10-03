import React from "react";

import {Accordion, Button, Form} from "react-bootstrap";

import { apiKey } from "../api";
import SearchedBooksModal from "./SearchedBooksModal";

export default function NewBookForm(props) {
	function showSearchedBooks() {
		let searchTerm = document.getElementById("title").value;
		let apiUrl = "https://www.googleapis.com/books/v1/volumes?q="+searchTerm.replace(" ", "+")+"&key="+apiKey;
		fetch(apiUrl)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			setSearchedBooks(data.items);
			setShowSearchedBooksModal(true);
		})
		.catch(error => {
			console.error('Error:', error);
		});
	}
	
	function getBook(volumeId) {
		let apiUrl = "https://www.googleapis.com/books/v1/volumes/"+volumeId+"?key="+apiKey;
		fetch(apiUrl)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			document.getElementById("title").value = data.volumeInfo.title + (data.volumeInfo.hasOwnProperty("subtitle") ? ": " + data.volumeInfo.subtitle : "");
			document.getElementById("author").value = data.volumeInfo.authors.join(", ");
			
			document.getElementById("descriptionText").innerHTML = data.volumeInfo.description;
			document.getElementById("description").value = document.getElementById("descriptionText").innerText;

			document.getElementById("coverUrl").value = data.volumeInfo.imageLinks.large;

			closeSearchedBooksModal();
		})
		.catch(error => {
			console.error('Error:', error);
		});
	}

	function closeSearchedBooksModal() {
		setShowSearchedBooksModal(false);
	}

	function setRequired() {
		if (document.getElementById("cover").files.length === 0) {
			document.getElementById("coverUrl").setAttribute("required", "true");
		} else {
			document.getElementById("coverUrl").removeAttribute("required");
		}
	}

	const [searchedBooks, setSearchedBooks] = React.useState([]);
	const [showSearchedBooksModal, setShowSearchedBooksModal] = React.useState(false);

	return (
		<>
		<Accordion>
			<Accordion.Item eventKey="0">
				<Accordion.Header>Add New Book</Accordion.Header>
				<Accordion.Body>
					<Form id="addBookForm" method="post" action="/addBook" encType="multipart/form-data">
						<Form.Control id="id" name="id" hidden={true} value={props.id} readOnly={true}/> 
						<Form.Group className="mrgn-btm-15">
							<Form.Label htmlFor="title">Title:</Form.Label>
							<Form.Control size="lg" type="text" id="title" name="title" required={true} />
							<br/>
							<Button variant="primary" size="lg" onClick={showSearchedBooks}>Search</Button>
						</Form.Group>
						<Form.Group className="mrgn-15">
							<Form.Label htmlFor="author">Author:</Form.Label>
							<Form.Control size="lg" type="text" id="author" name="author" required={true} />
						</Form.Group>
						<Form.Group className="mrgn-15">
							<Form.Label htmlFor="description">Description:</Form.Label>
							<Form.Control size="lg" as="textarea" id="description" name="description" rows={10} required={true} />
							<div id="descriptionText" tabIndex={"-1"}></div></Form.Group>
						<Form.Group className="mrgn-15">
							<Form.Label htmlFor="cover">Cover URL:</Form.Label>
							<Form.Control size="lg" type="text" id="coverUrl" name="coverUrl" required={true} />
						</Form.Group>
						<Form.Group className="mrgn-15">
							<Form.Label htmlFor="cover">Cover:</Form.Label>
							<Form.Control size="lg" type="file" id="cover" name="cover" accept="image/*" style={{height: "100%"}} onInput={setRequired} />
						</Form.Group>
						<Button variant="primary" type="submit" size="lg">
							Submit
						</Button>
					</Form>
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
		<SearchedBooksModal
			showModal={showSearchedBooksModal}
			closeModal={closeSearchedBooksModal}
			items={searchedBooks}
			getBook={getBook}
		/>
		</>
	)
}