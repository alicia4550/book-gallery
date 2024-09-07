// When the user clicks on an image, open the modal
function openModal(id) {
	// Define the API URL
	const apiUrl = '/book?id='+id;

	// Make a GET request
	fetch(apiUrl)
	.then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.json();
	})
	.then(data => {
		document.getElementById("modal-id").textContent = data.id;
		document.getElementById("modal-img").src = './public/images/' + data.imageurl;
		document.getElementById("modal-title").textContent = data.title;
		document.getElementById("modal-author").textContent = data.author;
		document.getElementById("modal-description").innerHTML = data.description.replaceAll("\n", "<br>");
		document.getElementById("bookModal").style.display = "block";
	})
	.catch(error => {
		console.error('Error:', error);
	});
}

// Open the form modal when user clicks on the "Add new book" button
function openForm() {
	document.getElementById("formModal").style.display = "block";
}

document.addEventListener("DOMContentLoaded", function(event) {
	// Get the modals
	var bookModal = document.getElementById("bookModal");
	var formModal = document.getElementById("formModal");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close");

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		bookModal.style.display = "none";
		formModal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == bookModal) {
			bookModal.style.display = "none";
		} else if (event.target == formModal) {
			formModal.style.display = "none";
		}
	}
});

document.addEventListener("keyup", function(event) {
	if (document.getElementById("bookModal").style.display == "block") {
		if (event.key == 'ArrowLeft') {
			// left arrow
			var id = parseInt(document.getElementById("modal-id").textContent);
			if (id > 1) {
				openModal(id-1);
			}
		}
		else if (event.key == 'ArrowRight') {
			// right arrow
			var id = parseInt(document.getElementById("modal-id").textContent);
			if (id < document.querySelectorAll(".cover-img").length) {
				openModal(id+1);
			}
		}
	}
});