const Book = require("../models/Book");

// 👇 Controller to create a new book
const createBook = async (data) => {
  const book = new Book(data);
  return await book.save();
};

// 👇 Controller to fetch all books
const getAllBooks = async () => {
  return await Book.find();
};

// 👇 Controller to update a book
const updateBook = async (id, data) => {
  return await Book.findByIdAndUpdate(id, data, { new: true });
};

// 👇 Controller to delete a book
const deleteBook = async (id) => {
  return await Book.findByIdAndDelete(id);
};

module.exports = {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook
};
