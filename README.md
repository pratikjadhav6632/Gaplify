# Gaplify

This is a full-stack authentication demo built with the MERN stack (MongoDB, Express.js, React, Node.js) and Vite.

## Features

- User authentication (Signup/Login)
- Protected routes
- JWT token-based authentication
- Responsive UI with Tailwind CSS
- MongoDB integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Create a `.env` file in the server directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/mern-auth
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## Running the Application

1. Start the backend server:

```bash
cd server
npm run dev
```

2. Start the frontend development server:

```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/      # React context
│   │   └── App.jsx       # Main application component
│   └── package.json
│
└── server/                # Backend Express application
    ├── models/           # MongoDB models
    ├── routes/           # API routes
    ├── index.js         # Server entry point
    └── package.json
```

## Technologies Used

- Frontend:
  - React
  - Vite
  - React Router
  - Tailwind CSS
  - Axios

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT
  - bcryptjs 
