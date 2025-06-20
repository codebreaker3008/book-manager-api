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

// Routes
const bookRoutes = require("./routes/books");
app.use("/api/books", bookRoutes);

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
            background-color: #f4f4f4;
            font-family: "Segoe UI", sans-serif;
            margin: 0;
            padding: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
          }
          h1 {
            color: #2c3e50;
            font-size: 2.5em;
          }
          p {
            font-size: 1.2em;
            color: #555;
          }
          a {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
          }
          a:hover {
            text-decoration: underline;
          }
          .card {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
            max-width: 600px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>📚 Welcome to the Book Manager API</h1>
          <p>This is a custom-built REST API for managing a library of books.</p>
          <p>Use the following endpoint to access the API:</p>
          <p><a href="/api/books">/api/books</a></p>
          <p>Built with <strong>Node.js</strong>, <strong>Express</strong>, and <strong>MongoDB</strong>.</p>
        </div>
      </body>
      </html>
    `);
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
