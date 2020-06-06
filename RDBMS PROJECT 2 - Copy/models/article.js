var mongoose = require("mongoose");

var articleSchema = new mongoose.Schema({
    title: String,
    image: {type: String,default:"https://www.frevvo.com/blog/wp-content/uploads/2020/01/Frevvo-Save-Data-Hero-1000x529.png"},
    body: String,
    author: String,
    created : {type: Date , default: Date.now} 
});

module.exports = mongoose.model("Article",articleSchema);