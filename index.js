const http = require('http');
const fs = require('fs');
const express = require("express");
const cheerio = require('cheerio');
var xlsx = require('node-xlsx');

function Book(id, title, author, description, imageurl) {
	this.id = id;
	this.title = title;
	this.author = author;
	this.description = description;
	this.imageurl = imageurl;
}


var bookdata = xlsx.parse(__dirname + '/book data.xlsx')[0].data;
bookdata.shift();

var books = [];
for (const book of bookdata) {
	books.push(new Book(book[0], book[1], book[2], book[3], book[4]));
}

fs.readFile('views/index.html', 'utf8', function(err, data) {
	if (err) throw err;

	var $ = cheerio.load(data);

	$('.gallery').html('');

	for (const book of books) {
		$('.gallery').append('<img class="cover-img" src="./public/images/'+book.imageurl+'" onclick="openModal('+book.id+')">');
	}

	fs.writeFile("views/index.html", $.html(), function(err) {
		if(err) {
			throw err;
		}
	});
});

const app = express();
const PORT = 3000;

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname, { // host the whole directory
	extensions: ["html", "htm", "gif", "png"],
}))

app.get('/', (req, res)=>{
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
})