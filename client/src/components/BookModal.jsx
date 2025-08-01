import {Modal, Button} from "react-bootstrap";

export default function BookModal(props) {
	return (
		<Modal show={props.showModal} onHide={props.closeModal} animation={false} centered dialogClassName="modal80">
			<Modal.Header closeButton />
			<Modal.Body>
				<div className="row">
					<div className="col-md-5 text-center"><img id="modal-img" src={props.imageUrl} alt={props.title}/></div>
					<div className="col-md-7" id="bookDetails">
						<b><h1 id="modal-title">{props.title}</h1></b>
						<i><h2 id="modal-author">{props.author}</h2></i>
						<br/>
						<i><h3 id="modal-pageCount">{props.pageCount} pages</h3></i>
						<br/>
						<div id="modal-description">
							{props.description.split('\n').map((line, index) => (
								<p key={index}>
									{line.trim() === '' ? '' : line}
								</p>
							))}
						</div>
						<div className="genre-list">
							{props.genres.map((genre, index) => (
								<div className="genre-list-item" key={index}>
									<p>{genre}</p>
								</div>
							))}
						</div>
					</div>
				</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" size="lg" onClick={props.closeBookModal}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
	)
}