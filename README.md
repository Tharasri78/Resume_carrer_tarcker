# Resume Job Tracker

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A full-stack web application that helps users manage job applications and resumes in one place. Users can add job applications, track their status, upload resumes, and monitor their job search progress through a simple and user-friendly dashboard.

## Features

- User Registration and Login
- Secure JWT Authentication
- Add, Edit, and Delete Job Applications
- Track Application Status
- Resume Upload and Management
- Dashboard with Application Statistics
- Responsive User Interface

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication

## Project Structure

```text
Frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── api/
│   └── assets/

Backend/
│
├── src/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── middleware/
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/Tharasri78/Resume_carrer_tarcker.git
cd Resume_carrer_tarcker
```

### Install Backend Dependencies

```bash
cd Backend
npm install
npm run dev
```

### Install Frontend Dependencies

```bash
cd Frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Author

**Thara Sri**

GitHub: https://github.com/Tharasri78
