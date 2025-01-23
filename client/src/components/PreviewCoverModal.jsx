import {Modal, Button} from "react-bootstrap";

export default function PreviewCoverModal(props) {
	return (
		<Modal show={props.showModal} onHide={props.closeModal} animation={false} centered dialogClassName="modal80">
			<Modal.Header closeButton><h2>Preview Cover:</h2></Modal.Header>
			<Modal.Body>
				<img src={props.coverUrl} alt={props.bookTitle} id="previewCoverImage"/>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" size="lg" onClick={props.closeModal}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
	)
}