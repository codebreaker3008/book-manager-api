const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const Book = require("./models/Book");

dotenv.config();

const app = express();

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book Manager API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
const bookRoutes = require("./routes/books");
app.use("/api/books", bookRoutes);

// HTML: Home Page with Forms
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>📚 Book Manager API</title>
      <style>
        body {
          font-family: "Segoe UI", sans-serif;
          background-color: #f4f4f4;
          padding: 30px;
        }
        .card {
          background: white;
          padding: 20px;
          margin: 0 auto 20px;
          max-width: 600px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        h1, h2 {
          text-align: center;
        }
        label {
          display: block;
          margin: 8px 0 4px;
        }
        input {
          width: 100%;
          padding: 8px;
          margin-bottom: 12px;
        }
        button {
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
        form {
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>📚 Welcome to the Book Manager API</h1>
        <p><a href="/api/books">View All Books</a> | <a href="/api-docs">API Docs</a></p>
      </div>

      <div class="card">
        <h2>Add a New Book</h2>
        <form method="POST" action="/add-book">
          <label>Title</label>
          <input type="text" name="title" required />
          <label>Author</label>
          <input type="text" name="author" required />
          <label>Genre</label>
          <input type="text" name="genre" />
          <label>Published Year</label>
          <input type="number" name="publishedYear" />
          <button type="submit">Add Book</button>
        </form>
      </div>

      <div class="card">
        <h2>Search Book by ID</h2>
        <form method="GET" action="/search-book">
          <label>Book ID</label>
          <input type="text" name="id" required />
          <button type="submit">Search</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// HTML routes for add/update/delete
app.post("/add-book", async (req, res) => {
  try {
    const { title, author, genre, publishedYear } = req.body;
    const newBook = new Book({ title, author, genre, publishedYear });
    await newBook.save();
    res.redirect("/api/books");
  } catch (err) {
    res.status(500).send("Failed to add book.");
  }
});

app.post("/delete-book/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect("/api/books");
  } catch (err) {
    res.status(500).send("Error deleting book.");
  }
});

app.post("/update-book/:id", async (req, res) => {
  try {
    const { title, author, genre, publishedYear } = req.body;
    await Book.findByIdAndUpdate(req.params.id, { title, author, genre, publishedYear });
    res.redirect("/api/books");
  } catch (err) {
    res.status(500).send("Error updating book.");
  }
});

app.get("/search-book", async (req, res) => {
  try {
    const book = await Book.findById(req.query.id);
    if (!book) return res.send("<h2>Book not found.</h2>");

    res.send(`
      <h1>${book.title}</h1>
      <p>Author: ${book.author}</p>
      <p>Genre: ${book.genre}</p>
      <p>Published Year: ${book.publishedYear}</p>
      <p>ID: ${book._id}</p>
    `);
  } catch (err) {
    res.status(400).send("<h2>Invalid ID format or error occurred.</h2>");
  }
});

app.get("/edit-book/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.send("<h2>Book not found.</h2>");

    res.send(`
      <h2>Edit Book</h2>
      <form method="POST" action="/update-book/${book._id}">
        <label>Title</label><input name="title" value="${book.title}" /><br />
        <label>Author</label><input name="author" value="${book.author}" /><br />
        <label>Genre</label><input name="genre" value="${book.genre}" /><br />
        <label>Published Year</label><input name="publishedYear" type="number" value="${book.publishedYear}" /><br />
        <button type="submit">Update</button>
      </form>
    `);
  } catch (err) {
    res.status(500).send("Error loading edit form.");
  }
});

// Book list (UI)
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    const bookCards = books.map(book => `
      <div class="card">
        <h2>${book.title}</h2>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>Published:</strong> ${book.publishedYear}</p>
        <form method="POST" action="/delete-book/${book._id}" onsubmit="return confirm('Delete this book?');">
          <button>Delete</button>
        </form>
        <form method="GET" action="/edit-book/${book._id}">
          <button>Edit</button>
        </form>
      </div>
    `).join("");

    res.send(`
      <html>
        <head><title>All Books</title></head>
        <body>
          <h1>📚 All Books</h1>
          ${bookCards}
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send("Failed to load books.");
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: "Invalid input" });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB Atlas");
  app.listen(5000, () => {
    console.log("🚀 Server is running at http://localhost:5000");
  });
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});
