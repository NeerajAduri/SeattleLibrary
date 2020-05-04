var mongoose = require('mongoose');

var LibInventorySchema = new mongoose.Schema({
    
    BibNum:String,
    Title:String,
    Author:String,
    PublicationYear:String,
    Publisher:String,
    ItemType:String,
    ItemCollection:String,
    ItemCount:String,
    CollectionDesc:String,
    CategoryGroup:String,
    TypeDesc:String,
    FormatGroup:String,
    FormatSubgroup:String
});

module.exports = mongoose.model("LibInventory",LibInventorySchema);