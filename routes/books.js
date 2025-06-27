const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - genre
 *         - publishedYear
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the book
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         genre:
 *           type: string
 *         publishedYear:
 *           type: integer
 *       example:
 *         title: "Sapiens"
 *         author: "Yuval Noah Harari"
 *         genre: "History"
 *         publishedYear: 2011
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of all books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 */

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Book not found
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to delete
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */

// GET all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST add a new book
router.post("/", async (req, res) => {
  const { title, author, genre, publishedYear } = req.body;

  // Validate presence and types
  if (
    !title || typeof title !== "string" ||
    !author || typeof author !== "string" ||
    !genre || typeof genre !== "string" ||
    typeof publishedYear !== "number"
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const newBook = new Book({ title, author, genre, publishedYear });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET a specific book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});

// PUT update a book
router.put("/:id", async (req, res) => {
  const { title, author, genre, publishedYear } = req.body;

  // Require all fields to be present and valid
  if (
    !title || typeof title !== "string" ||
    !author || typeof author !== "string" ||
    !genre || typeof genre !== "string" ||
    typeof publishedYear !== "number"
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, genre, publishedYear },
      {
        new: true,
        runValidators: false
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a book
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports = router;