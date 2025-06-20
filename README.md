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


### 2. 📦 Install Dependencies

npm install

### 3.🔐 Create Environment File

MONGO_URI=mongodb+srv://<your-username>:<your-password>@cluster0.mongodb.net/bookmanager?retryWrites=true&w=majority

### 4. ▶️ Start the Server

npm run dev


---

Let me know if you'd like me to:
- Add badges (Build passing ✅, License 🔓, etc.)
- Help write a deployable version of this API on Render
- Include frontend integration instructions (if you decide to build one)

You're good to submit this as a polished API project! ✅

