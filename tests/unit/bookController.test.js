const Book = require("../../models/Book");
const {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook
} = require("../../controllers/bookController");

jest.mock("../../models/book"); // Mock Book model

describe("📘 Unit Tests: Book Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a book", async () => {
    const data = { title: "Unit Book", author: "Mock" };
    Book.prototype.save = jest.fn().mockResolvedValue(data);

    const result = await createBook(data);
    expect(result.title).toBe("Unit Book");
    expect(Book.prototype.save).toHaveBeenCalled();
  });

  it("should fetch all books", async () => {
    const mockBooks = [{ title: "Book A" }, { title: "Book B" }];
    Book.find = jest.fn().mockResolvedValue(mockBooks);

    const result = await getAllBooks();
    expect(result.length).toBe(2);
    expect(Book.find).toHaveBeenCalled();
  });

  it("should update a book", async () => {
    const updated = { title: "Updated Book" };
    Book.findByIdAndUpdate = jest.fn().mockResolvedValue(updated);

    const result = await updateBook("123", updated);
    expect(result.title).toBe("Updated Book");
    expect(Book.findByIdAndUpdate).toHaveBeenCalled();
  });

  it("should delete a book", async () => {
    const deleted = { _id: "123", title: "Delete Me" };
    Book.findByIdAndDelete = jest.fn().mockResolvedValue(deleted);

    const result = await deleteBook("123");
    expect(result._id).toBe("123");
    expect(Book.findByIdAndDelete).toHaveBeenCalled();
  });
});
