const http = require('http');
const fs = require('fs');
const request = require('request');
const express = require("express");
const xlsx = require('node-xlsx');
const bodyParser = require('body-parser');
const exceljs = require('exceljs');
var multer = require('multer');

function Book(id, title, author, description, imageurl, date, type, genres) {
	this.id = id;
	this.title = title;
	this.author = author;
	this.description = description;
	this.imageurl = imageurl;
	this.date = date;
    this.type = type;
    this.genres = genres;
}

var bookdata = xlsx.parse(__dirname + '/bookdata.xlsx')[0].data;
bookdata.shift();

var books = [];
for (const book of bookdata) {
	books.push(new Book(book[0], book[1], book[2], book[3], book[4], book[5], book[6], book[7]));
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

	let nameFileExcel = __dirname + '/bookdata.xlsx';
	var workbook = new exceljs.Workbook();
	workbook.xlsx.readFile(nameFileExcel)
	.then(function()  {
		var worksheet = workbook.getWorksheet(1);
		var lastRow = worksheet.lastRow;
		var getRowInsert = worksheet.getRow(++(lastRow.number));
		getRowInsert.getCell('A').value = Number(req.body.id);
		getRowInsert.getCell('B').value = req.body.title;
		getRowInsert.getCell('C').value = req.body.author;
		getRowInsert.getCell('D').value = req.body.description;
		getRowInsert.getCell('E').value = setImageFileName(req);
		getRowInsert.getCell('F').value = today;
        getRowInsert.getCell('G').value = req.body.type;
        getRowInsert.getCell('H').value = req.body.genres.replaceAll("\r\n", " / ");
		getRowInsert.commit();
		return workbook.xlsx.writeFile(nameFileExcel);
	});

	books.push(new Book(req.body.id, req.body.title, req.body.author, req.body.description, setImageFileName(req), today));
	
	console.log('added data');
	res.redirect('/');
});

app.get('/getBooks', function(req, res) {
	var bookdata = xlsx.parse(__dirname + '/bookdata.xlsx')[0].data;
	bookdata.shift();

	var books = [];
	for (const book of bookdata) {
		books.push(new Book(book[0], book[1], book[2], book[3], book[4], book[5], book[6], book[7]));
	}

	res.json({ message: books });
});

app.get('/getGenres', function(req, res) {
    var bookdata = xlsx.parse(__dirname + '/bookdata.xlsx')[0].data;
	bookdata.shift();

	var genres = [];
	for (const book of bookdata) {
		genres.push(...book[7].split(" / "));
	}
    genres = [...new Set(genres)].sort();

	res.json({ message: genres });
})