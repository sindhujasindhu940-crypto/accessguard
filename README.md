# Digital Visitor Authorization and Tracking System 🎓

A state-of-the-art full-stack modern web application for college security and visitor management. 

## Features
- **Premium UI:** Glassmorphism, 3D Mockups, Framer Motion animations.
- **Role-Based Dashboards:** Specific views for Admin, Security Staff, Faculty, and Visitors.
- **Digital Passes:** Generates beautiful, responsive QR-ready digital passes.
- **Real-Time Tracking:** Entry and exit logs with live campus counts.

## Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Framer Motion, Axios, Lucide React
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT Auth, bcryptjs

## Setup Instructions

### 1. Prerequisites
- Node.js installed (v16+)
- MongoDB installed and running locally on standard port (27017)

### 2. Backend Setup (`/server`)
1. Open a terminal and navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm run dev
   ```
   *(Server starts on http://localhost:5000)*

### 3. Frontend Setup (`/client`)
1. Open a new terminal and navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React app:
   ```bash
   npm run dev
   ```
   *(Frontend starts on http://localhost:5173)*

## Accounts for Testing
You can create new roles dynamically via the registration page. Simply go to `/register` and create an "Admin", "Security", or "Faculty" account to explore the different dashboards. Or register a visitor publicly at the home page!
