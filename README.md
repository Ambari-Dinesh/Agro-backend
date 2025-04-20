# 🥦 Fruit & Vegetable Bulk Ordering Platform

A full-stack application that allows users to order fresh fruits and vegetables in bulk. It supports user login, admin product management, and order tracking.

## 📁 Project Structure

---backend/  
   ---routes/
   ---utils/
    index.js

## 🔧 Backend Setup (Express + PostgreSQL)

### Prerequisites

- Node.js (v16+)
- PostgreSQL

---

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/fruit-veg-ordering-platform.git
cd fruit-veg-ordering-platform/backend



2. Install Dependencies

npm install
3. Create .env File
Create a .env file inside the backend directory:

PORT=5000
DATABASE_URL=postgresql://your_pg_user:your_pg_password@localhost:5432/your_db_name
JWT_SECRET=your_jwt_secret
Replace with your actual PostgreSQL credentials.

4. Setup the Database
Make sure PostgreSQL is running and then create the database:

CREATE DATABASE your_db_name;
Your backend should handle creating tables or use migrations if implemented.

5. Start the Server

npm start
The backend will run at: http://localhost:5000