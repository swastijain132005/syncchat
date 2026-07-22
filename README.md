# 🚀 SyncChat – AI Powered Real-Time Messaging Platform

A full-stack real-time messaging platform built using the **MERN Stack** and **Socket.IO**, featuring AI-powered communication tools such as Smart Replies, Conversation Summary, Translation, and Tone Rewrite. The application delivers a modern messaging experience with real-time synchronization, secure authentication, media sharing, and intelligent chat assistance.

---

## ✨ Features

### 💬 Real-Time Messaging
- Instant one-to-one messaging using Socket.IO
- Online/Offline user presence
- Typing indicator
- Read receipts (Seen status)
- Auto-scroll to latest message

### 📸 Media Sharing
- Image upload and sharing
- Cloudinary integration for media storage

### ✏️ Message Management
- Edit sent messages
- Delete messages
- Emoji reactions with live synchronization

### 🤖 AI Features
- Smart Reply Suggestions
- Conversation Summary
- Message Translation
- Tone Rewrite (Professional, Friendly, Formal, etc.)

### 🔒 Authentication & Security
- JWT Authentication
- Protected Routes
- Secure REST APIs
- Password hashing using bcrypt

---

## 🛠 Tech Stack

### Frontend
- React.js
- Context API
- Axios
- Tailwind CSS
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT Authentication
- Cloudinary

### AI
- OpenRouter API
- Large Language Models (LLMs)

---

## 🏗 System Architecture

Client
↓
React + Context API
↓
REST APIs + Socket.IO
↓
Express.js Server
↓
MongoDB + Cloudinary
↓
OpenRouter LLM API

---

## ⚡ Real-Time Events

- newMessage
- newReaction
- messagesSeen
- typing
- stopTyping
- userOnline
- userOffline

---

## 📂 Project Structure

```
SyncChat
│
├── client
│   ├── components
│   ├── pages
│   ├── context
│   ├── assets
│   └── lib
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── config
│   └── socket
│
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/syncchat.git
```

### Install Dependencies

Frontend

```bash
cd frontend
npm install
```

Backend

```bash
cd backend
npm install
```

---

## 🔑 Environment Variables

### Backend

```env
PORT=

MONGODB_URI=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

OPENROUTER_API_KEY=
```

---

## ▶ Run Locally

Backend

```bash
nodemon server.js
```

Frontend

```bash
npm run dev
```

---



---

## 🎯 Key Highlights

- Event-driven real-time communication using Socket.IO
- AI-assisted messaging powered by LLM APIs
- Secure authentication using JWT
- Cloud-based media storage with Cloudinary
- Optimized React Context state management
- Modular and reusable component architecture

---

## 🔮 Future Enhancements

- Group Chat
- Voice Messages
- Polls
- Message Search
- Push Notifications
- Video Calling
- End-to-End Encryption

---

## 👨‍💻 Author

**Swasti Jain**

B.Tech CSE | MERN Stack Developer
