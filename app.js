// Importing the express package and by calling the express() method 
// we are instantiating the application
const express    		= require("express"),
	  app		   		= express(),
	  bodyParser = require('body-parser'),
	  mongoose = require('mongoose'),
	  book=require("./models/book"),
	  LibInventorySchema=require("./models/LibInventory"),
	  LibCheckoutSchema=require("./models/LibCheckout");
	
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
 var db;
// var LibInventory;
//mongoose.connect('mongodb+srv://NeerajAduri:Neeraj@123@admtopgun-oqfij.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true,useCreateIndex: true})

mongoose.connect('mongodb://localhost:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&3t.uriVersion=3&3t.connection.name=ADM_TopGun/ADM_DB', {useNewUrlParser: true,useCreateIndex: true})
.then(()=> {
	   console.log('Connected to DB!');
   }).catch(err => {
	   console.log('ERROR: ', err.message);
});

var conn = mongoose.connection;

app.get("/", function(req, res) {
	res.render("homepage");
});


app.get("/addbook", function(req, res){
		res.render("addbook");
});


app.post("/book",function(req,res){
	console.log(req.body);
	var BibNum = req.body.BibNum;
	var Title=req.body.Title;
	var Author=req.body.Author;
	var PublicationYear=req.body.PublicationYear;
	var Publisher=req.body.Publisher;
	var ItemType = req.body.ItemType;
	var ItemCollection=req.body.ItemCollection;
	var ItemCount=req.body.ItemCount;
    var CollectionDesc=req.body.CollectionDesc;
    var CategoryGroup=req.body.CategoryGroup;
    var TypeDesc=req.body.TypeDesc;
    var FormatGroup=req.body.FormatGroup;
    var FormatSubgroup=req.body.FormatSubgroup;
	//console.log(BibNum);
	var newLibInventory = {BibNum: BibNum,Title: Title,Author: Author ,Publisher: Publisher ,
	PublicationYear:PublicationYear, ItemType : ItemType,ItemCollection: ItemCollection ,ItemCount: ItemCount,
	CollectionDesc:CollectionDesc, CategoryGroup:CategoryGroup,TypeDesc:TypeDesc,FormatGroup:FormatGroup,
	FormatSubgroup:FormatSubgroup};

	conn.collection('LibInventory').insertOne(newLibInventory);
	res.redirect("/");
});


//Business Question 1: I recently read a book written by author X. I want to know if there are other books written by the same author in the same category and available in stock?
// Request for business question one comes to the below request mapping of '/query1'
// Query 1 helps in finding the other books written by the author whose book I read recently
// and in the same category by using the subquery to find the author and category group
app.get("/query1", function(req, res){

	// conn.collection('LibInventory').find({Author:"Hollick, Helen"}).toArray(function(err, authors){
	// 	var author = authors;
	// 	res.render("query1",{author:author});	
	// });

	conn.collection("LibInventory").find({ "Author": "Hollick, Helen", "ID": { $exists: false }, "Category Group": "Fiction" }, 
	{ "BibNum": 1, "Title": 1, "Author": 1, "Category Group": 1}).toArray(function(err,author){
		res.render("query1",{author:author})
	});


});



//Business Question 2: Which are the top 10 popular books based on the number of times it is checked out?
// Request for business question two comes to the below request mapping of '/query2'
// Query 2 finds the top 10 popular books based on the number of times it is checked out
// We are using Group By BibNum and Order By keyword in finding the top 10 popular books

app.get("/query2", function(req, res){

	conn.collection('LibInventory').aggregate([
        { $group: {
            _id: {
                BibNum:"$BibNum", 
                ID : "$exists: 0", 
                Title:"$Title" , 
                Author:"$Author"},
        count:{$sum:1}}}, 
        {$sort:{"count":-1}},
        {$limit:10}
            
    ],  { allowDiskUse: true }).toArray(function(err, results) {
        console.log(results);
        //res.json(results);
        res.render("query2", {results: results});
    });
	
});


//Business Question 3:  Which books have never been checked out?
// Request for business question three comes to the below request mapping of '/query3'
// Query 3 assists in answering which books have never been checked out
// This is achieved through using the NOT operator and the sub query concept

app.get("/query3", function(req, res){

	//db.LibDatabase.find({"ItemBarcode" : { "$exists" : 0 } } ).pretty();
	conn.collection("LibCheckout").find({ItemBarcode:null}).limit(2000).toArray(function(err, docs){
		console.log(docs);
		res.render("query3",{results:docs});
	
		
// 	const query = "Select distinct BibNum, Title from LibInventory where  BibNum NOT IN (select distinct BibNum from LibCheckout) ORDER BY BibNum LIMIT 100;";

// 	db.query(query, function (error, results, fields) {  
// 	   if (error) {console.log(error)} else { 
// 		 //console.log(results);
// 		 res.render("query3", {results: results});
// 		} 
   }); 
  
});

//Business Question 4:  Most checked out books by category to determine the reading trends?
// Request for business question four comes to the below request mapping of '/query4'
// Query 4 helps in determining the reading trends based on most checked out books by category 
// This is achieved by using aggregate functions, joins and Group By

app.get("/query4", function(req, res){
	
	conn.collection("LibCheckout").aggregate([
		{ "$match": { "ID": { "$ne": null }}},
		{ "$group": {
			   "_id": {
					"BibNum":"$BibNum",  
					"CategoryGroup":"$Category Group"
			   },
			   "count": { "$sum": 1 }
		}},
		   { "$group": {
			   "_id": {
				   "CategoryGroup":"$_id.CategoryGroup" },
		CheckoutCount: { $sum:  "$count"}
		   }}, {$sort:{"CheckoutCount": -1}}], { allowDiskUse: true }).toArray(function(err,results){
			   console.log(results);
			   res.render("query4",{results:results});
		   })
  
});

app.listen(3000, function(){
	console.log("Server has started!");
});
// hosting the application on local machine