async function getSearchedBooksByTitle(searchTerm) {
	let apiUrl = "https://www.googleapis.com/books/v1/volumes?q="+searchTerm.replace(" ", "+")+"&key="+process.env.API_KEY;
	
	try {
		const apiResult = await fetch(apiUrl);
		const data = await apiResult.json();

		return data.items.map(book => {
			return {
				id: book.id,
				imgUrl: book.volumeInfo.hasOwnProperty("imageLinks") ? book.volumeInfo.imageLinks.thumbnail : "",
				title: book.volumeInfo.title + (book.volumeInfo.hasOwnProperty("subtitle") ? ": " + book.volumeInfo.subtitle : ""),
				author: book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "",
				snippet: book.hasOwnProperty("searchInfo") ? book.searchInfo.textSnippet : ""
			}
		});
	} catch(error) {
		throw error;
	}
}

async function getSearchedBooksByISBN(isbn) {
	let apiUrl = "https://www.googleapis.com/books/v1/volumes?q=isbn:"+isbn+"&key="+process.env.API_KEY;
	
	try {
		const apiResult = await fetch(apiUrl);
		const data = await apiResult.json();

		return data.items.map(book => {
			return {
				id: book.id,
				imgUrl: book.volumeInfo.hasOwnProperty("imageLinks") ? book.volumeInfo.imageLinks.thumbnail : "",
				title: book.volumeInfo.title + (book.volumeInfo.hasOwnProperty("subtitle") ? ": " + book.volumeInfo.subtitle : ""),
				author: book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "",
				snippet: book.hasOwnProperty("searchInfo") ? book.searchInfo.textSnippet : ""
			}
		});
	} catch(error) {
		throw error;
	}
}

async function getBook(volumeId) {
	let apiUrl = "https://www.googleapis.com/books/v1/volumes/"+volumeId+"?key="+process.env.API_KEY;
	console.log(apiUrl)

	try {
		const apiResult = await fetch(apiUrl);
		const data = await apiResult.json();

		let categories = data.volumeInfo.hasOwnProperty("categories") ? data.volumeInfo.categories.join(" / ").split(" / ") : [];
		categories = [...new Set(categories)].filter((el) => el !== 'General' && el !== 'Subjects & Themes');
		
		return {
			title: data.volumeInfo.title + (data.volumeInfo.hasOwnProperty("subtitle") ? ": " + data.volumeInfo.subtitle : ""),
			author: data.volumeInfo.authors.join(", "),
			description: data.volumeInfo.description,
			genres: categories,
			type: categories.join().includes("Fiction") ? "Fiction" : "Nonfiction",
			pageCount: data.volumeInfo.printedPageCount,
			imageLink: getImageLink(data.volumeInfo.imageLinks)
		}
	} catch(error) {
		throw error;
	}
}

function getImageLink(imageLinks) {
	if (imageLinks.hasOwnProperty("large")) return imageLinks.large.replace("&edge=curl", "");
	else if (imageLinks.hasOwnProperty("medium")) return imageLinks.medium.replace("&edge=curl", "");
	else if (imageLinks.hasOwnProperty("small")) return imageLinks.small.replace("&edge=curl", "");
	else if (imageLinks.hasOwnProperty("thumbnail")) return imageLinks.thumbnail.replace("&edge=curl", "");
	else if (imageLinks.hasOwnProperty("smallThumbnail")) return imageLinks.smallThumbnail.replace("&edge=curl", "");
	else return "";
}

module.exports = {
	getSearchedBooksByTitle,
	getSearchedBooksByISBN,
	getBook
}