const mongoose = require('mongoose');

//schema defination
const postSchema = mongoose.Schema({
  title: { type: String, required: true},
  content: { type: String, required: true},
  imagePath: { type: String, required: true},
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true} //user id
});

//model
module.exports = mongoose.model('Post', postSchema);

