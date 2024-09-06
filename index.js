const http = require('http');
const fs = require('fs');
const express = require("express");
const cheerio = require('cheerio');
const xlsx = require('node-xlsx');
const bodyParser = require('body-parser');
const exceljs = require('exceljs');
var multer = require('multer');

function Book(id, title, author, description, imageurl) {
	this.id = id;
	this.title = title;
	this.author = author;
	this.description = description;
	this.imageurl = imageurl;
}

var books = [];

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/images/')
	},
	filename: function (req, file, cb) {
		var imageName = req.body.title.indexOf(':') == -1 ? req.body.title : req.body.title.substring(0, req.body.title.indexOf(':'));
		cb(null, imageName + ".jpg") //Appending extension
	}
})
  
var upload = multer({ storage: storage });

function setBooks() {
	var bookdata = xlsx.parse(__dirname + '/book data.xlsx')[0].data;
	bookdata.shift();

	books = [];
	for (const book of bookdata) {
		books.push(new Book(book[0], book[1], book[2], book[3], book[4]));
	}

	fs.readFile('views/index.html', 'utf8', function(err, data) {
		if (err) throw err;

		var $ = cheerio.load(data);

		$('.gallery').html('');

		for (const book of books) {
			$('.gallery').append('\n\t\t\t<img class="cover-img" src="./public/images/'+book.imageurl+'" onclick="openModal('+book.id+')">');
		}
		$('.gallery').append("\n\t\t");

		fs.writeFile("views/index.html", $.html(), function(err) {
			if(err) {
				throw err;
			}
		});
	});
}

const app = express();
const PORT = 3000;

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname, { // host the whole directory
	extensions: ["html", "htm", "gif", "png"],
}))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res)=>{
	setBooks();
	res.status(200);
	res.render('index.html', {books});
});

app.listen(PORT, (error) =>{
	if(!error) {
		console.log("Server is Successfully Running, and App is listening on port "+ PORT);
	}
	else {
		console.log("Error occurred, server can't start", error);
	}
});

app.get('/book', function(req, res) {
	const id = req.query.id;
	res.send(books[Number(id)-1]);
});

app.post('/addBook', upload.single('cover'), function(req, res) {
	console.log('receiving data ...');
	var imageName = req.body.title.indexOf(':') == -1 ? req.body.title : req.body.title.substring(0, req.body.title.indexOf(':'));

	let nameFileExcel = __dirname + '/book data.xlsx';
	var workbook = new exceljs.Workbook();
	workbook.xlsx.readFile(nameFileExcel)
	.then(function()  {
		var worksheet = workbook.getWorksheet(1);
		var lastRow = worksheet.lastRow;
		var getRowInsert = worksheet.getRow(++(lastRow.number));
		getRowInsert.getCell('A').value = lastRow.number;
		getRowInsert.getCell('B').value = req.body.title;
		getRowInsert.getCell('C').value = req.body.author;
		getRowInsert.getCell('D').value = req.body.description;
		getRowInsert.getCell('E').value = imageName + ".jpg";
		getRowInsert.commit();
		return workbook.xlsx.writeFile(nameFileExcel);
	});

	res.redirect('/');
});