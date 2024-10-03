import {Accordion, Button, Form} from "react-bootstrap";

export default function FormModal(props) {
	return (
		<Accordion>
				<Accordion.Item eventKey="0">
					<Accordion.Header>Add New Book</Accordion.Header>
					<Accordion.Body>
						<Form id="addBookForm" method="post" action="/addBook" encType="multipart/form-data">
							<Form.Control id="id" name="id" hidden={true} value={props.id} readOnly={true}/> 
							<Form.Group>
								<Form.Label htmlFor="title">Title:</Form.Label>
								<Form.Control size="lg" type="text" id="title" name="title" required={true} />
							</Form.Group>
							<Form.Group>
								<Form.Label htmlFor="author">Author:</Form.Label>
								<Form.Control size="lg" type="text" id="author" name="author" required={true} />
							</Form.Group>
							<Form.Group>
								<Form.Label htmlFor="description">Description:</Form.Label>
								<Form.Control size="lg" as="textarea" id="description" name="description" rows={10} required={true} />
							</Form.Group>
							<Form.Group>
								<Form.Label htmlFor="cover">Cover:</Form.Label>
								<Form.Control size="lg" type="file" id="cover" name="cover" accept="image/*" required={true} style={{height: "100%"}} />
							</Form.Group>
							<br/>
							<Button variant="primary" type="submit" size="lg">
								Submit
							</Button>
						</Form>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
	)
}