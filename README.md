# 📌 Project - TicketEase

TicketEase is a **ticket management system** designed to streamline issue tracking, real-time chat communication, and permission control.

---

## ✅ To-Do List

✔️ ~~Authorization with permissions and roles (Manageable modal in the admin panel).~~  
✔️ ~~Real-time chat using WebSocket.~~  
🔲 Dashboard for ticket management.  
🔲 Real-time notifications.  
🔲 Assign permissions per ticket category.  
🔲 Dynamic form creation.
🔲 Docker.

---

## 🛠️ Technologies Used
Frontend

    ⚡ React + Vite – Fast and modern frontend development.
    🎨 Bootstrap + Custom CSS – For UI styling and responsive design.
    🏗 TypeScript – Strongly typed JavaScript for better maintainability.
    🔄 React Context API + Hooks – State management and reusable logic.
    🔗 React Router – Enables single-page application (SPA) navigation.

Backend

    🏢 Spring Boot – Robust Java backend for handling API requests.
    🔐 JWT Authentication – Secure login with role-based access control.
    📩 Spring WebSocket – Real-time communication for chat and notifications.
    🌐 RESTful API – API endpoints for frontend communication.

Other Technologies

    🚀 WebSocket (STOMP) – Real-time chat and notifications.
    📡 Axios – HTTP requests for API communication.
    📝 ESLint + Prettier – Code formatting and linting for clean development.

---

## 🚀 Implementation

### 🔧 Environment Setup

1️⃣ **Create a `.env.local` file inside the `/frontend/` directory.**  
2️⃣ **Add the required environment variables** as shown in the example below:

```ini
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080/ws
