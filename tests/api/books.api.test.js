const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const bookRoutes = require("../../routes/books");
const Book = require("../../models/Book");

// 🔧 Setup express app
const app = express();
app.use(express.json());
app.use("/api/books", bookRoutes);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await Book.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("📘 API Tests for /api/books", () => {
  it("GET /api/books should return an empty array initially", async () => {
    const res = await request(app)
      .get("/api/books")
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST /api/books should add a new book", async () => {
    const bookData = {
      title: "API Testing Book",
      author: "Ayush",
      genre: "Tech",
      publishedYear: 2024
    };

    const res = await request(app).post("/api/books").send(bookData);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("API Testing Book");
  });

  it("GET /api/books should return created books", async () => {
    await Book.create({ title: "Book 1", author: "A" });

    const res = await request(app)
      .get("/api/books")
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("PUT /api/books/:id should update a book", async () => {
    const book = await Book.create({ title: "Old Title", author: "A" });

    const res = await request(app)
      .put(`/api/books/${book._id}`)
      .send({ title: "New Title" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("New Title");
  });

  it("DELETE /api/books/:id should remove a book", async () => {
    const book = await Book.create({ title: "Delete Me", author: "A" });

    const res = await request(app).delete(`/api/books/${book._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
