var mongoose = require('mongoose');

var LibCheckoutSchema = new mongoose.Schema({
    BibNum : String,//"2451875", 
    Title : String,//"Highly recommended : English for the hotel and catering industry : student's book / Trish Stott & Rod Revell.", 
    Author :String, //"Stott, Trish", 
    PublicationYear : String,//"2018", 
    Publisher :String, //"Oxford University Press,", 
    ItemType : String,//"arbk", 
    ItemCollection : String,//"careadr", 
    ItemCount :String,// "1", 
    ID : String,//"201903141325000010060049052", 
    ItemBarcode : String,//"10060049052.0", 
    CheckoutYear : String,//"2019.0", 
    CheckoutDateTime : String,//"03-14-2019 01:25:00 ", 
    Description_x : String,//"CA5-Literacy Reference", 
    CategoryGroup : String,//"Reference", 
    Description_y : String,//"Book: Ref Adult/YA", 
    FormatGroup : String,//"Print", 
    FormatSubgroup : String//"Book"
});

module.exports = mongoose.model("LibCheckout",LibCheckoutSchema);