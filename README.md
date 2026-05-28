# Resume Job Tracker

Resume Job Tracker is a polished full-stack web application for managing job applications, organizing resumes, and tracking career progress from a single, secure dashboard.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Author](#author)
- [License](#license)

## Overview

This project combines a React-powered frontend with a Node.js and Express backend, backed by MongoDB for persistent storage. It provides authenticated users with tools to track applications, manage resumes, and receive reminders in a modern and responsive interface.

## Features

- Secure JWT-based authentication
- Protected client-side routes
- Job application CRUD functionality
- Resume upload, storage, and retrieval
- Status tracking for applications: Applied, Interview, Rejected, Selected
- ATS resume analyzer with job description matching
- AI-powered resume improvement suggestions
- Follow-up scheduling and deadline notifications
- Dashboard insights and summary statistics
- Responsive UI for desktop and mobile

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
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- CORS
- dotenv

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Architecture

`	ext
React Frontend
      ↕
Express API Backend
      ↕
   MongoDB Atlas
`

- Frontend: handles user interaction, state management, and API integration.
- Backend: exposes RESTful endpoints, enforces authentication, and manages business logic.
- Database: stores users, job records, resumes, and notifications.

## Repository Structure

### Frontend

`	ext
Frontend/
  src/
    api/          # API request utilities
    assets/       # Static assets
    components/   # Reusable UI components
    context/      # Auth and theme providers
    pages/        # Application views
    styles/       # CSS files
`

### Backend

`	ext
Backend/
  src/
    controllers/  # Route handlers and business logic
    middleware/   # Authentication and request middleware
    models/       # Mongoose schemas
    routes/       # API endpoint definitions
    utils/        # Helper utilities
`

## Installation

### 1. Clone the repository

`ash
git clone https://github.com/Tharasri78/Resume_carrer_tarcker.git
cd  Resume and carrer tracker
`

### 2. Install backend dependencies

`ash
cd Backend
npm install
`

### 3. Install frontend dependencies

`ash
cd ../Frontend
npm install
`

### 4. Run locally

Start the backend:

`ash
cd ../Backend
npm run dev
`

Start the frontend:

`ash
cd ../Frontend
npm run dev
`

The app should be available at http://localhost:5173 and the backend API at http://localhost:5000.

## Environment Variables

### Backend (Backend/.env)

`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
`

### Frontend (Frontend/.env)

`env
VITE_API_BASE_URL=http://localhost:5000/api
`

> Do not commit .env files. Keep secrets secure and use environment-specific values.

## API Endpoints

### Authentication

`http
POST /api/auth/register
POST /api/auth/login
`

### Jobs

`http
GET    /api/jobs
POST   /api/jobs
GET    /api/jobs/:id
PUT    /api/jobs/:id
DELETE /api/jobs/:id
`

### Dashboard

`http
GET /api/dashboard/stats
`

### Notifications

`http
GET    /api/notifications
POST   /api/notifications
PUT    /api/notifications/:id
DELETE /api/notifications/:id
`

## Deployment

- Deploy the frontend to Vercel.
- Deploy the backend to Render.
- Configure MongoDB Atlas for production.
- Set VITE_API_BASE_URL to the production backend URL.

## Author

**Thara Sri**

- GitHub: https://github.com/Tharasri78

## License

This project is intended for learning and portfolio demonstration purposes.
