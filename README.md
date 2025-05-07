# 📌 Project - TicketEase

TicketEase is a **ticket management system** designed to streamline issue tracking, real-time chat communication, and permission control.

---

## 🛠️ Technologies Used

### Frontend

- ⚡ **React + Vite** – Fast and modern frontend development.
- 🎨 **Bootstrap + Custom CSS** – For UI styling and responsive design.
- 🏗 **TypeScript** – Strongly typed JavaScript for better maintainability.
- 🔄 **React Context API + Hooks** – State management and reusable logic.
- 🔗 **React Router** – Enables single-page application (SPA) navigation.

### Backend

- 🏢 **Spring Boot** – Robust Java backend for handling API requests.
- 🔐 **JWT Authentication** – Secure login with role-based access control.
- 📩 **Spring WebSocket** – Real-time communication for chat and notifications.
- 🌐 **RESTful API** – API endpoints for frontend communication.

### Other Technologies

- 🚀 **WebSocket (STOMP)** – Real-time chat and notifications.
- 📡 **Axios** – HTTP requests for API communication.
- 📝 **ESLint + Prettier** – Code formatting and linting for clean development.
- 🐳 **Docker + Docker Compose** – Containerized full stack setup.
- 🐘 **PostgreSQL** – Database containerized with Docker.

---

## 🚀 Implementation

### 🐳 Docker Setup

To run the full application stack using Docker:

#### 1️⃣ Create a `.env` file in the root directory:

```ini
# Backend
CORS_ALLOWED_ORIGINS=http://localhost:5173
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/ticketease
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# Frontend (used at build time)
VITE_API_BASE_URL=http://api:8080
VITE_WS_URL=ws://api:8080/ws

```

#### 2️⃣ Start the system:

```
docker-compose up --build
```
