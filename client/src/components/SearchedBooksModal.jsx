import {Modal, Button, Table} from "react-bootstrap";
import BookTableRow from "./BookTableRow";

export default function SearchedBooksModal(props) {
	return (
		<Modal show={props.showModal} onHide={props.closeModal} animation={false} centered dialogClassName="modal80">
			<Modal.Header closeButton><h2>Select a book:</h2></Modal.Header>
			<Modal.Body>
				<Table>
					<tbody>
					{!props.items ? <p>"Loading..."</p> : props.items.map((book, index) => {
						return (
							<BookTableRow
								key={book.id}
								id={book.id}
								imgUrl={book.volumeInfo.hasOwnProperty("imageLinks") ? book.volumeInfo.imageLinks.thumbnail : ""}
								title={book.volumeInfo.title + (book.volumeInfo.hasOwnProperty("subtitle") ? ": " + book.volumeInfo.subtitle : "")}
								author={book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : ""}
								snippet={book.hasOwnProperty("searchInfo") ? book.searchInfo.textSnippet : ""}
								getBook={props.getBook}
							/>
						)
					})}
					</tbody>
				</Table>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" size="lg" onClick={props.closeModal}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
	)
}