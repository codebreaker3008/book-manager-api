const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Book");
const bookRoutes = require("../routes/books");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Create app
const app = express();
app.use(express.json());
app.use("/api/books", bookRoutes);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
  await Book.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("📚 Book API Tests", () => {
  it("should add a new book", async () => {
    const res = await request(app).post("/api/books").send({
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian",
      publishedYear: 1949,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("1984");
  });

  it("should get all books", async () => {
    await Book.create({ title: "Book A", author: "Author A", genre: "Fiction", publishedYear: 2000 });
    const res = await request(app).get("/api/books").set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should update a book", async () => {
    const book = await Book.create({ title: "Book B", author: "Author B" });
    const res = await request(app).put(`/api/books/${book._id}`).send({ title: "Updated Book" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Book");
  });

  it("should delete a book", async () => {
    const book = await Book.create({ title: "Delete Me", author: "Someone" });
    const res = await request(app).delete(`/api/books/${book._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
