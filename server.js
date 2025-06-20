const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// Routes
const bookRoutes = require("./routes/books");
app.use("/api/books", bookRoutes);

const Book = require("./models/Book"); // Ensure it's loaded

app.post("/add-book", async (req, res) => {
  try {
    const { title, author, genre, publishedYear } = req.body;
    const newBook = new Book({ title, author, genre, publishedYear });
    await newBook.save();
    res.redirect("/api/books"); // Redirect to view after adding
  } catch (err) {
    res.status(500).send("Failed to add book. Please try again.");
  }
});

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Connected to MongoDB Atlas");

  // 🌐 Homepage
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
        <p><a href="/api/books">View All Books</a></p>
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

app.get("/search-book", async (req, res) => {
  try {
    const book = await Book.findById(req.query.id);
    if (!book) return res.send("<h2>Book not found.</h2>");

    res.send(`
      <html>
        <head>
          <title>Book Details</title>
          <style>
            body { font-family: sans-serif; padding: 40px; background: #f9f9f9; }
            .card {
              background: white;
              padding: 30px;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              max-width: 500px;
              margin: auto;
            }
            h1 { text-align: center; color: #007bff; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>📘 ${book.title}</h1>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Genre:</strong> ${book.genre}</p>
            <p><strong>Published:</strong> ${book.publishedYear}</p>
            <p><strong>ID:</strong> ${book._id}</p>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(400).send("<h2>Invalid ID format or error occurred.</h2>");
  }
});


  // 🎨 Render books as styled HTML cards
  const Book = require("./models/Book"); // Assuming your model is here
  app.get("/api/books", async (req, res) => {
    try {
      const books = await Book.find();

      const bookCards = books.map(book => `
        <div class="card">
          <h2>📘 ${book.title}</h2>
          <p><strong>✍️ Author:</strong> ${book.author}</p>
          <p><strong>🏷️ Genre:</strong> ${book.genre}</p>
          <p><strong>📅 Published:</strong> ${book.publishedYear}</p>
        </div>
      `).join("");

      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>📚 All Books</title>
          <style>
            body {
              font-family: "Segoe UI", sans-serif;
              background-color: #f8f8f8;
              padding: 30px;
            }
            h1 {
              text-align: center;
              color: #333;
            }
            .container {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              max-width: 1000px;
              margin: auto;
            }
            .card {
              background-color: #fff;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              padding: 20px;
            }
            p {
              margin: 5px 0;
              color: #555;
            }
            h2 {
              color: #007bff;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <h1>📚 Book Collection</h1>
          <div class="container">
            ${bookCards}
          </div>
        </body>
        </html>
      `);
    } catch (err) {
      res.status(500).send("Something went wrong while loading books.");
    }
  });

  // 🚀 Start the server
  app.listen(5000, () => {
    console.log("🚀 Server is running at http://localhost:5000");
  });
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
});
