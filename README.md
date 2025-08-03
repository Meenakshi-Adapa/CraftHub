# 🧵 CraftHub - Local Handicraft Marketplace (MERN Stack)

**CraftHub** is a full-stack MERN application built to empower artisans by providing them a platform to showcase their handicrafts, connect directly with buyers, and conduct workshops. This project is designed to run locally on your system.

---

## 📌 Project Type
- **Local-only** project
- Not deployed
- Run via `localhost`

---

## ⚙️ Tech Stack

**Frontend**:
- React.js
- Tailwind CSS
- GSAP (for animations)
- Three.js (for visual enhancements)

**Backend**:
- Node.js
- Express.js
- MongoDB (with Mongoose)

**Others**:
- JWT Authentication
- Multer (for image uploads)
- Socket.IO (chat)
- dotenv, body-parser, CORS

---

## 🎯 Features

### 👥 Buyer Features
- Register/Login as a buyer
- Browse products
- Add items to cart
- Chat with artists for inquiries or bargaining
- Join live workshops (paid or free)
- Receive event notifications

### 🎨 Artist Features
- Register/Login as an artist
- Post and manage products
- View sales history
- Chat with customers
- Create webinars/workshops (free or paid)
- View orders to pack/ship
- Share workshop invites

---

## 📂 Folder Structure

CraftHub/
├── client/ # React Frontend
│ └── src/
│ ├── pages/
│ ├── components/
│ ├── assets/
│ ├── App.js
│ └── index.js
├── server/ # Express Backend
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ └── server.js
├── .env # Environment config
├── README.md
└── package.json

---

## 🧑‍💻 How to Run Locally

### 🔹 1. Clone the Repository
```bash
git clone https://github.com/your-username/crafthub.git
---
 Setup Backend
cd crafthub
cd backend
npm install
