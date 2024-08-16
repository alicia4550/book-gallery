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

document.addEventListener("DOMContentLoaded", function(event) {
	// Get the modal
	var modal = document.getElementById("bookModal");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
});