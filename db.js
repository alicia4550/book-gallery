const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

var MongoClient = require('mongodb').MongoClient;

// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb+srv://"+DB_USERNAME+":"+DB_PASSWORD+"@bookscluster.hvysw.mongodb.net/?retryWrites=true&w=majority&appName=BooksCluster";
const client = new MongoClient(uri);
// Get the database and collection on which to run the operation
const database = client.db("gallery");
const books = database.collection("books");

async function findAllBooks() {
	const options = {
		sort: { id: 1 }
	};
	const cursor = books.find({}, options);
	if ((await books.countDocuments()) === 0) {
		console.log("No documents found!");
	}
	return cursor.toArray();
}

async function writeNewBook(book) {
	const doc = { 
		id : book.id,
		title : book.title,
		author : book.author,
		description : book.description,
		imageurl : book.imageurl,
		date : book.date,
		type : book.type,
		genres : book.genres,
		pagecount : book.pageCount,
	};
	const result = await books.insertOne(doc);
	console.log(
		`A document was inserted with the _id: ${result.insertedId}`,
	);
}

async function findAllGenres() {
	const pipeline = [{$unwind:"$genres"},
		{$project:{"_id": 0, "genres": 1}}];

	const agg = await books.aggregate(pipeline).toArray();
	const genres = [...new Set(agg.map((el)=>el.genres))];
	genres.sort();

	return genres;
}

async function countTotalBooksRead(ytd) {
	const firstDayOfYear = new Date(new Date().getFullYear(), 0 , 1);

	var query = ytd ? {
		date : {$gte: firstDayOfYear}
	} : {};

	const count = await books.countDocuments(query);
	return count;
}

async function countTotalPagesRead(ytd) {
	const firstDayOfYear = new Date(new Date().getFullYear(), 0 , 1);

	var pipeline = ytd ? [{$match: {
		date : {$gte: firstDayOfYear}
	}}] : [];

	pipeline.push({$group:{_id:0,total:{$sum:"$pagecount"}}},
		{$project:{_id:0,total:1}});

	const agg = await books.aggregate(pipeline).toArray();

	if (agg.length == 0) return 0;
	return agg[0].total;
}

async function findTopAuthors(ytd) {
	const firstDayOfYear = new Date(new Date().getFullYear(), 0 , 1);

	var pipeline = ytd ? [{$match: {
		date : {$gte: firstDayOfYear}
	}}] : [];

	pipeline.push({$unwind:"$author"},
		{$group:{"_id":"$author","count":{$sum:1}}},
		{$group:{"_id":null,"author_details":{$push:{"author":"$_id",
													"count":"$count"}}}},
		{$project:{"_id":0,"author_details":1}});

	const agg = await books.aggregate(pipeline).toArray();

	if (agg.length == 0) return [];

	const counts = agg[0].author_details;
	counts.sort((a, b) => b.count - a.count);

	return counts;
}

async function findTopGenres(ytd) {
	const firstDayOfYear = new Date(new Date().getFullYear(), 0 , 1);

	var pipeline = ytd ? [{$match: {
		date : {$gte: firstDayOfYear}
	}}] : [];

	pipeline.push({$unwind:"$genres"},
		{$group:{"_id":"$genres","count":{$sum:1}}},
		{$match: {"_id" : {$ne: "Fiction"}}},
		{$group:{"_id":null,"genre_details":{$push:{"genre":"$_id",
													"count":"$count"}}}},
		{$project:{"_id":0,"genre_details":1}});

	const agg = await books.aggregate(pipeline).toArray();

	if (agg.length == 0) return [];

	const counts = agg[0].genre_details;
	counts.sort((a, b) => b.count - a.count);

	return counts;
}

async function countType(ytd) {
	const firstDayOfYear = new Date(new Date().getFullYear(), 0 , 1);

	var pipeline = ytd ? [{$match: {
		date : {$gte: firstDayOfYear}
	}}] : [];

	pipeline.push(
		{$group:{"_id":"$type", "count":{$sum:1}}});

	const agg = await books.aggregate(pipeline).toArray();

	if (agg.length == 0) return [];

	const types = agg.map((el) => {
		return {
			title: el._id,
			value: el.count,
			color: (el._id === "Fiction" ? '#E38627' : '#C13C37')
		}
	});
	types.sort((a,b) => b.title.localeCompare(a.title));

	return types;
}

// await client.close();

module.exports = {
	findAllBooks,
	writeNewBook,
	findAllGenres,
	countTotalBooksRead,
	countTotalPagesRead,
	findTopAuthors,
	findTopGenres,
	countType
};