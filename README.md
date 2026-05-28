# Resume Job Tracker

A **full-stack MERN application** designed to help users efficiently manage and track their job search process.
The platform allows users to **store job applications, track interview progress, manage resumes, and receive follow-up reminders** from a centralized dashboard.

The project demonstrates **secure authentication, REST API development, database management, and full-stack deployment using modern web technologies.**

---

# Live Application

Live Application
[https://resume-job-tracker-bay.vercel.app](https://resume-job-tracker-bay.vercel.app)


Demo:https://drive.google.com/file/d/1EfBOe7XZn-yhxwRHwLvPQ0qzbxHX9DJx/view?usp=drivesdk


---

# Key Features

• Secure user authentication using JWT
• Protected routes for authorized access
• Job application management system
• Resume storage and organization
• Application status tracking

* Applied
* Interview
* Rejected
* Selected

• Dashboard statistics for job progress
• Follow-up reminder system
• Notification management
• Responsive and user-friendly interface

---

# Tech Stack

## Frontend

* React.js
* Vite
* Axios
* React Router

## Backend

* Node.js
* Express.js
* JWT Authentication

## Database

* MongoDB Atlas

## Deployment

* Frontend: Vercel
* Backend: Render

---

# System Architecture

```
React Client (Vercel)
        │
        ▼
Node.js + Express API (Render)
        │
        ▼
MongoDB Atlas Database
```

1. The **React frontend** handles the user interface and user interactions.
2. The **Express backend** provides REST APIs for authentication, job management, and notifications.
3. **MongoDB Atlas** stores user data, job applications, and related information.

---

# Project Structure

## Frontend

```
frontend
 └── src
     ├── api          # API request services
     ├── components   # Reusable UI components
     ├── context      # Authentication state management
     ├── pages        # Application pages
     └── styles       # CSS files
```

## Backend

```
backend
 └── src
     ├── routes        # API route definitions
     ├── controllers   # Business logic
     ├── models        # MongoDB schemas
     ├── middleware    # Authentication & error handling
     └── utils         # Helper functions
```

---

# Environment Variables

## Frontend

```
VITE_API_BASE_URL=https://resume-job-tracker-1.onrender.com/api
```

## Backend

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
```

---

# Installation & Setup

## 1. Clone the Repository

```
git clone https://github.com/Tharasri78/Resume_carrer_tarcker
cd Resume_carrer_tarcker
```

---

## 2. Run Backend

```
cd backend
npm install
npm run dev
```

Backend server will start on:

```
http://localhost:5000
```

---

## 3. Run Frontend

```
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

# API Endpoints

## Authentication

```
POST /api/auth/register
POST /api/auth/login
```

## Job Management

```
GET    /api/jobs
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id
```

## Dashboard

```
GET /api/dashboard/stats
```

## Notifications

```
GET /api/notifications
```

---

# Author

**Thara Sri**

GitHub
[https://github.com/Tharasri78](https://github.com/Tharasri78)

---

# License

This project is developed for **learning and portfolio demonstration purposes**.

---
