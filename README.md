# 📚 Book Manager API

A simple and customizable Book Management REST API built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.

- Perform CRUD operations (Create, Read, Update, Delete) on book records
- Returns **HTML in browser** and **JSON in API clients**
- Use Postman or a frontend to interact with the APIs

---

## 🚀 Features

- Add new books
- View all books (beautiful HTML in browser / JSON in Postman)
- Update book details
- Delete books
- Hosted on MongoDB Atlas
- CORS-enabled for frontend support
## THE UPDATE AND DELETE OPTION ARE AVAILABLE WHEN YOU VIEW THE COLLECTION
---

## 🧱 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **ORM**: Mongoose
- **Tools**: Nodemon, Postman

---

## 📁 Project Structure

book-manager-api/
├── models/
│ └── book.js # Book schema
├── routes/
│ └── books.js # Book routes
├── .env # Environment config
├── server.js # Entry point
├── package.json
└── README.md


---

## 🔧 Setup Instructions

### 1. 🍴 Clone the Repository

```bash
git clone https://github.com/codebreaker3008/book-manager-api.git
cd book-manager-api
```

### 2. 📦 Install Dependencies

npm install

### 3.🔐 Create Environment File

MONGO_URI=mongodb+srv://<your-username>:<your-password>@cluster0.mongodb.net/bookmanager?retryWrites=true&w=majority

### 4. ▶️ Start the Server

npm run dev

## 🧪 Testing

### ✅ Unit Tests

- Tested controller logic using **Jest Mocks**
- Verified logic in isolation (e.g., `getAllBooks`, `updateBook`)
- ✅ 100% coverage for `controllers/` and `models/`

### ✅ Integration Tests

- Used `mongodb-memory-server` to simulate MongoDB
- Verified full CRUD operation interaction with real models

### ✅ API Tests

- Simulated HTTP requests using `Supertest`
- Covered endpoint behavior, response status, payload checks

---

## 📊 Code Coverage

Achieved over **87%** coverage across the project:

![Screenshot 2025-06-21 234954](https://github.com/user-attachments/assets/f7a094c6-878c-478a-bd5f-aba7ae863b7c)

---

# Run all tests with coverage
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:int

# Run only API tests
npm run test:api
# Trigger workflow
