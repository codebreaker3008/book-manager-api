const mongoose = require("mongoose");


const bookSchema = new mongoose.Schema({
  title: { type: String },         // no "required"
  author: { type: String },
  genre: { type: String },
  publishedYear: {}               // accepts any type: number, string, etc.
});

module.exports = mongoose.model("Book", bookSchema);

bookSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});
