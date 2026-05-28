# Resume Job Tracker

A **full-stack application** for tracking job applications, managing resumes, and monitoring career progress from a single dashboard.

Users can:

- Create and manage job applications
- Track application status and interview progress
- Upload and organize resumes
- Receive notifications and follow-up reminders
- Access protected pages with secure authentication

---

## Live Demo

- Frontend: https://resume-job-tracker-bay.vercel.app
- Demo Video: https://drive.google.com/file/d/1EfBOe7XZn-yhxwRHwLvPQ0qzbxHX9DJx/view?usp=drivesdk

---

## Key Features

- JWT-based user authentication
- Protected frontend routes
- Job application CRUD operations
- Resume management
- Application status tracking (Applied, Interview, Rejected, Selected)
- Dashboard analytics and statistics
- Notification system for reminders
- Responsive UI built with React and Tailwind

---

## Tech Stack

### Frontend

- React
- Vite
- Axios
- React Router
- Tailwind CSS

### Backend

- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- CORS
- dotenv

### Deployment

- Frontend: Vercel
- Backend: Render

---

## System Architecture

```
React Frontend (Vercel)
        │
        ▼
Node.js + Express Backend (Render)
        │
        ▼
MongoDB Atlas
```

---

## Repository Structure

### Frontend

```
Frontend/
  src/
    api/            # API request utilities
    assets/         # Static assets
    components/     # Reusable UI components
    context/        # Auth and theme providers
    pages/          # Screen pages and views
    styles/         # CSS files
```

### Backend

```
Backend/
  src/
    controllers/    # Request handlers and business logic
    middleware/     # Auth and error middleware
    models/         # Mongoose schemas
    routes/         # API routes
    utils/          # Helper functions
```

---

## Environment Variables

### Backend (`Backend/.env`)

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
```

### Frontend (`Frontend/.env`)

```
VITE_API_BASE_URL=http://localhost:5000/api
```

> Note: Update the frontend API base URL for local development and production deployments as needed.

---

## Installation & Local Setup

### 1. Clone repository

```bash
git clone https://github.com/Tharasri78/Resume_carrer_tarcker.git
cd "Resume and carrer tracker"
```

### 2. Backend setup

```bash
cd Backend
npm install
npm run dev
```

Backend will start on `http://localhost:5000` by default.

### 3. Frontend setup

```bash
cd ../Frontend
npm install
npm run dev
```

Frontend will start on `http://localhost:5173` by default.

---

## API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
```

### Job Management

```
GET    /api/jobs
POST   /api/jobs
GET    /api/jobs/:id
PUT    /api/jobs/:id
DELETE /api/jobs/:id
```

### Dashboard

```
GET /api/dashboard/stats
```

### Notifications

```
GET    /api/notifications
POST   /api/notifications
PUT    /api/notifications/:id
DELETE /api/notifications/:id
```

---

## Notes

- Make sure MongoDB Atlas is configured and accessible from the backend.
- Keep `JWT_SECRET` secure and do not commit `.env` files to source control.
- For production, update `VITE_API_BASE_URL` to the deployed backend URL.

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
```
