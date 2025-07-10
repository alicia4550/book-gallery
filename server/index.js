const db = require('./db.js');
const api = require('./googleBooksApi.js');

const fs = require('fs');
const request = require('request');
const express = require("express");
const bodyParser = require('body-parser');
var multer = require('multer');
const XLSX = require("xlsx");

console.log(process.env.API_KEY);
console.log(process.env.DB_PASSWORD);

function Book(id, title, author, description, imageurl, date, type, genres, pageCount) {
	this.id = id;
	this.title = title;
	this.author = author;
	this.description = description;
	this.imageurl = imageurl;
	this.date = date;
	this.type = type;
	this.genres = genres;
	this.pageCount = pageCount;
}

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './server/public/images/')
	},
	filename: function (req, file, cb) {
		cb(null, setImageFileName(req))
	}
})
  
var upload = multer({ storage: storage });

var download = function(uri, filename, callback){
	request.head(uri, function(err, res, body){
		console.log('content-type:', res.headers['content-type']);
		console.log('content-length:', res.headers['content-length']);

		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
};

function setImageFileName(req) {
	var title = req.body.title.indexOf(':') == -1 ? req.body.title : req.body.title.substring(0, req.body.title.indexOf(':'));
	title = title.replace(/[/\\?%*:|"<>]/g, '');
	var fileName = req.body.id + " " + title + ".jpg";
	return fileName;
}

const app = express();
const PORT = 8080;

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname, { // host the whole directory
	extensions: ["html", "htm", "gif", "png"],
}))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.listen(PORT, (error) =>{
	if(!error) {
		console.log("Server is Successfully Running, and App is listening on port "+ PORT);
	}
	else {
		console.log("Error occurred, server can't start", error);
	}
});

app.post('/addBook', upload.single('cover'), function(req, res) {
	console.log('receiving data ...');

	if (req.body.coverUrl != '') {
		download(req.body.coverUrl, './server/public/images/' + setImageFileName(req), function(){
			console.log('saved image');
		});
	}

	let today = new Date();
	const book = new Book(Number(req.body.id), 
							req.body.title,
							req.body.author.split(", "), 
							req.body.description, 
							setImageFileName(req), 
							today, 
							req.body.type,
							req.body.genres.split("\r\n"),
							Number(req.body.pageCount)
						);
	db.writeNewBook(book);

	console.log('added data');
	res.redirect('/');
});

app.get('/getBooks', function(req, res) {
	db.findAllBooks().then((result) => {
		var books = [];
		for (const book of result) {
			books.push(new Book(book.id, book.title, book.author.join(", "), book.description, book.imageurl, book.date, book.type, book.genres, book.pagecount));
		}
		res.json({ message: books });
	}).catch(console.dir);
});

app.get('/download', function(req, res) {
	db.findAllBooks().then((result) => {
		// Books Sheet
		var bookdata = JSON.parse(JSON.stringify(result));
		bookdata.map((book, index) => {
			book._id = book._id.toString();
			book.author = book.author.join(", ");
			book.genres = book.genres.join(", ");
			return book;
		});
		var workbook = XLSX.utils.book_new();
		var ws_allData = XLSX.utils.json_to_sheet(bookdata);
		XLSX.utils.book_append_sheet(workbook, ws_allData, "Books");
		let exportFileName = "Books.xlsx";

		Promise.all([
			db.countTotalBooksRead(false),
			db.countTotalPagesRead(false),
			db.findTopAuthors(false),
			db.findTopGenres(false),
			db.countType(false),
		]).then((stats) => {
			// Statistics Sheet
			var statsData = [
				["Statistic", "Value"],
				["Total Books Read", stats[0]],
				["Total Pages Read", stats[1]],
				["Total Fiction Books Read", stats[4].find((obj) => obj.title === "Fiction").value],
				["Total Nonfiction Books Read", stats[4].find((obj) => obj.title === "Nonfiction").value]
			  ];
			var ws_stats = XLSX.utils.aoa_to_sheet(statsData);
			XLSX.utils.book_append_sheet(workbook, ws_stats, "Statistics");

			// Authors Sheet
			var ws_authors = XLSX.utils.json_to_sheet(stats[2]);
			XLSX.utils.book_append_sheet(workbook, ws_authors, "Authors");

			// Genres Sheet
			var ws_genres = XLSX.utils.json_to_sheet(stats[3]);
			XLSX.utils.book_append_sheet(workbook, ws_genres, "Genres");

			XLSX.writeFile(workbook, "./server/public/" + exportFileName);
			res.download("./server/public/" + exportFileName);
		});
	}).catch(console.dir);
});

app.get('/getGenres', function(req, res) {
	db.findAllGenres().then((result) => {
		res.json({ message: result });
	}).catch(e => {
		console.log(e);
	});
});

app.get('/getStatistics', function(req, res) {
	Promise.all([
		db.countTotalBooksRead(false),
		db.countTotalBooksRead(true),
		db.countTotalPagesRead(false),
		db.countTotalPagesRead(true),
		db.findTopAuthors(false),
		db.findTopAuthors(true),
		db.findTopGenres(false),
		db.findTopGenres(true),
		db.countType(false),
		db.countType(true)
	]).then((stats) => {
		res.json({ 
			totalBooksRead : stats[0],
			totalBooksReadYTD : stats[1],
			totalPagesRead : stats[2],
			totalPagesReadYTD : stats[3],
			topAuthors : stats[4],
			topAuthorsYTD : stats[5],
			topGenres : stats[6],
			topGenresYTD : stats[7],
			typeCount : stats[8],
			typeCountYTD : stats[9]
		});
	});
});

app.get('/getSearchedBooksByTitle', function(req, res) {
	api.getSearchedBooksByTitle(req.query.searchTerm).then((result) => {
		res.json({ message: result });
	}).catch(e => {
		console.log(e);
	});
});

app.get('/getSearchedBooksByISBN', function(req, res) {
	api.getSearchedBooksByISBN(req.query.isbn).then((result) => {
		res.json({ message: result });
	}).catch(e => {
		console.log(e);
	});
});

app.get('/getSearchedBook', function(req, res) {
	console.log(req.query.volumeId);
	api.getBook(req.query.volumeId).then((result) => {
		res.json({ message: result });
	}).catch(e => {
		console.log(e);
	});
});