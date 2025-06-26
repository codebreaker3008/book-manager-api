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
 *
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
 */
const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// GET all books
router.get("/", async (req, res) => {
  const books = await Book.find();

  // 👉 Check the Accept header
  if (req.headers.accept && req.headers.accept.includes("application/json")) {
    return res.json(books); // 🟢 Postman or API request
  }


  
  // 🟢 Build HTML for browser
  const bookCards = books.map(book => `
    <div class="card">
      <h2>📘 ${book.title}</h2>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Genre:</strong> ${book.genre}</p>
      <p><strong>Published:</strong> ${book.publishedYear}</p>

      <form method="POST" action="/delete-book/${book._id}" onsubmit="return confirm('Delete this book?');">
        <button style="background:#dc3545;color:white;padding:8px;border:none;border-radius:4px;">🗑️ Delete</button>
      </form>

      <form method="GET" action="/edit-book/${book._id}" style="margin-top:10px;">
        <button style="background:#007bff;color:white;padding:8px;border:none;border-radius:4px;">✏️ Edit</button>
      </form>
    </div>
  `).join("");

  res.send(`
    <html>
      <head>
        <title>📚 Book List</title>
        <style>
          body { font-family: sans-serif; padding: 40px; background: #f2f2f2; }
          .card {
            background: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            max-width: 600px;
          }
        </style>
      </head>
      <body>
        <h1>📚 All Books</h1>
        ${bookCards}
      </body>
    </html>
  `);
});

module.exports = router;

// GET a specific book by ID
router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.json(book);
});

// POST add a new book
router.post("/", async (req, res, next) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    next(error); // Pass validation error to middleware
  }
});

// PUT update book
router.put("/:id", async (req, res, next) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true // 🔥 ensure validations are run on update
    });
    if (!updated) return res.status(404).json({ error: "Book not found" });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});


// DELETE a book
router.delete("/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted" });
});

module.exports = router;
