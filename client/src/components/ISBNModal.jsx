import React from "react";
import {Modal, Button, Form} from "react-bootstrap";

import { useMediaDevices } from "react-media-devices";
import { useZxing } from "react-zxing";

export default function ISBNModal(props) {
	const constraints = {
		video: true,
		audio: false,
	};
	const { devices } = useMediaDevices({ constraints });
	
	const [deviceId, setDeviceId] = React.useState(devices ? devices[1].deviceId : "");
	const [manualISBN, setManualISBN] = React.useState("");
	
	const { ref } = useZxing({
		paused : !props.showModal,
		deviceId : deviceId !== "" ? deviceId : "",
		onDecodeResult(result) {
			const isbn = result.getText();
			props.searchBook(isbn);
			props.closeModal();
		},
		onError(error) {
			console.log(error);
		}
	});

	function searchByManualISBN() {
		props.searchBook(manualISBN);
		props.closeModal();
	}

	return (
		<Modal show={props.showModal} onHide={props.closeModal} animation={false} centered dialogClassName="modal80">
			<Modal.Header closeButton><h2>Search by ISBN:</h2></Modal.Header>
			<Modal.Body>
				<Form.Group id="videoInput">
					<Form.Label htmlFor="inputDevice">Input Device:</Form.Label>
					<Form.Select size="lg" className="form-input" id="inputDevice" defaultValue={0} onInput={(e)=>{setDeviceId(e.target.value)}}>
						{!devices ? <option value={0}>No available sources</option> : 
						devices.filter((value) => value.kind === "videoinput").map((device, index) => {
							return (
								<option key={index} value={device.deviceId}>{device.label}</option>
							)
						})}
					</Form.Select>
					<video ref={ref} />
				</Form.Group>
				<Form.Group>
					<Form.Label htmlFor="manualISBN">Enter ISBN Manually:</Form.Label>
					<Form.Control size="lg" type="text" id="manualISBN" name="manualISBN" required={true} onInput={(e)=>setManualISBN(e.target.value)} />
					<br />
					<Button variant="primary" size="lg" onClick={searchByManualISBN} disabled={manualISBN.length === 0}>Search by ISBN</Button>
				</Form.Group>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" size="lg" onClick={props.closeModal}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}