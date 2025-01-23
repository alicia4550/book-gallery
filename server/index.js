const db = require('./db.js');

const fs = require('fs');
const request = require('request');
const express = require("express");
const bodyParser = require('body-parser');
var multer = require('multer');

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
		cb(null, './public/images/')
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
const PORT = 3001;

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
							req.body.author, 
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
			books.push(new Book(book.id, book.title, book.author, book.description, book.imageurl, book.date, book.type, book.genres, book.pagecount));
		}
		res.json({ message: result });
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