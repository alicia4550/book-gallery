import {Modal, Button, Table} from "react-bootstrap";
import BookTableRow from "./BookTableRow";

export default function SearchedBooksModal(props) {
	return (
		<Modal show={props.showModal} onHide={props.closeModal} animation={false} centered dialogClassName="modal80">
			<Modal.Header closeButton><h2>Select a book:</h2></Modal.Header>
			<Modal.Body>
				<Table>
					<tbody>
					{!props.items || props.items.length === 0 ? <p className="text">No books found. Please add your new book manually.</p> : props.items.map((book, index) => {
						return (
							<BookTableRow
								key={book.id}
								id={book.id}
								imgUrl={book.imgUrl}
								title={book.title}
								author={book.author}
								snippet={book.snippet}
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