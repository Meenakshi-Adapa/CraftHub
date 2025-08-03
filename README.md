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
```
## 📸 Screenshots

### 🔹 Buyer Home Page
<img width="100%" alt="Screenshot 2025-03-10 113532" src="https://github.com/user-attachments/assets/906cc921-4374-465f-889a-06af28299532" />

### 🔹 Product View
<img width="100%" alt="Screenshot 2025-03-10 113633" src="https://github.com/user-attachments/assets/bed57480-5fc3-4d98-a14d-42203fa2fdbd" />

### 🔹 Artist Dashboard
<img width="100%" alt="Screenshot 2025-03-18 150412" src="https://github.com/user-attachments/assets/be894c3a-d54f-4c34-9105-09a6df4663f8" />

### 🔹 Live Workshop View
<img width="100%" alt="Screenshot 2025-03-10 113619" src="https://github.com/user-attachments/assets/9d245317-d040-479a-9e55-bc0047a62e73" />

