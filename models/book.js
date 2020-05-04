var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
    
    BibNum:String,
    title:String,
    author:String,
    publicationyear:String,
    publisher:String,
    itemType:String,
    itemCollection:String,
    itemCount:String

});

module.exports = mongoose.model("book",bookSchema);