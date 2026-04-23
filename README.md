# 👻 GhostCode (AlgoArena)

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://mongodb.com)
[![AI Powered](https://img.shields.io/badge/AI-Gemini-orange.svg)](https://deepmind.google/technologies/gemini/)
[![Collaboration](https://img.shields.io/badge/Realtime-Yjs-green.svg)](https://yjs.dev/)

**GhostCode** is a high-performance, full-stack collaborative coding platform designed for developers to solve DSA problems together, compete in gamified duels, and receive AI-powered feedback on their solutions.

---

## ✨ Key Features

### 🤝 Real-time Collaboration
*   **Multi-user Editing**: Conflict-free synchronization powered by **Yjs** CRDTs.
*   **Live Cursors**: Track editor activity for every participant in the room.
*   **Monaco Editor**: A premium, industry-standard editor experience.

### ⚔️ Duel Arena (1v1 Battles)
*   **Gamified Coding**: Compete against others in a race to solve problems.
*   **Dynamic HP System**: Get answers right to damage your opponent; errors hurt your own health!
*   **Anti-Cheat Protection**: Integrated focus and fullscreen tracking to ensure fair play.

### 🤖 AI-Powered Analysis
*   **Complexity Reports**: Automatic Time and Space complexity estimation using **Google Gemini**.
*   **Solution Optimization**: Receive intelligent suggestions to improve your code.

### 🎙️ Integrated Communication
*   **Voice Chat**: Low-latency P2P voice channels integrated via **PeerJS (WebRTC)**.
*   **Real-time Chat**: Instant messaging for quick collaboration.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Material UI, Tailwind CSS, GSAP, Framer Motion |
| **Backend** | Node.js, Express.js, Socket.io |
| **Database** | MongoDB (Mongoose) |
| **Collaboration** | Yjs, y-websocket, PeerJS |
| **AI** | Google Generative AI (Gemini) |

---

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16+)
*   [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/ASHISH-SAINI78021/AlgoArena.git
    cd AlgoArena
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in `backend/` following the `.env.example` (or refer to the Environment Variables section below).

3.  **Setup Frontend**
    ```bash
    cd ../frontend
    npm install
    ```
    Create a `.env` file in `frontend/` following the template.

### Running Locally

*   **Start Backend Server**:
    ```bash
    cd backend
    npm run dev
    ```
*   **Start Frontend Dev Server**:
    ```bash
    cd frontend
    npm run dev
    ```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
MONGO_URI=your_mongodb_connection_string
PORT=5001
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
OPENROUTER_API_KEY=your_api_key
GITHUB_CLIENT_ID=your_id
GITHUB_CLIENT_SECRET=your_secret
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
VITE_YJS_WEBSOCKET_URL=ws://localhost:5001/yjs
VITE_VOICE_SERVER_HOST=localhost
VITE_VOICE_SERVER_PORT=5001
VITE_VOICE_SERVER_PATH=/voice-peer
```

---

## 📦 Deployment
The project is configured for easy deployment on:
*   **Frontend**: Netlify / Vercel
*   **Backend**: Render / Railway

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License
This project is licensed under the MIT License.
