const mongoose =require("mongoose");

var nailSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
})
module.exports=mongoose.model('Nail', nailSchema);
