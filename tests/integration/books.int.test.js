const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const bookRoutes = require("../../routes/books");
const Book = require("../../models/Book");

const app = express();
app.use(express.json());
app.use("/api/books", bookRoutes);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterEach(async () => {
  await Book.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("📗 Integration Tests: Book API", () => {
  it("should create a book (POST)", async () => {
    const res = await request(app).post("/api/books").send({
      title: "Integration Book",
      author: "Tester",
      genre: "Testing",
      publishedYear: 2025
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Integration Book");
  });

  it("should get all books (GET)", async () => {
    await Book.create({ title: "Book 1", author: "Author" });
    await Book.create({ title: "Book 2", author: "Author" });

    const res = await request(app).get("/api/books");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("should update a book (PUT)", async () => {
    const book = await Book.create({ title: "Old Title", author: "Author" });

    const res = await request(app)
      .put(`/api/books/${book._id}`)
      .send({ title: "New Title" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("New Title");
  });

  it("should delete a book (DELETE)", async () => {
    const book = await Book.create({ title: "Delete Me", author: "Author" });

    const res = await request(app).delete(`/api/books/${book._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
