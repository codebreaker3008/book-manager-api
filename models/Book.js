const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minlength: 1,
    maxlength: 150,
    trim: true
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    minlength: 1,
    maxlength: 100,
    trim: true
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    minlength: 1,
    maxlength: 100,
    trim: true
  },
  publishedYear: {
    type: Number,
    required: [true, "Published year is required"],
    min: [0, "Published year cannot be negative"],
    max: [new Date().getFullYear(), "Published year cannot be in the future"]
  }
});

module.exports = mongoose.model("Book", bookSchema);
