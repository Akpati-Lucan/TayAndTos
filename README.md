# 🏨 Tay and Tos Accommodation

> A full-stack room booking and accommodation management platform for **Tay and Tos Accommodation** in **Ado-Ekiti, Nigeria**.

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 18">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/SendGrid-Email-00A98F?style=for-the-badge&logo=sendgrid&logoColor=white" alt="SendGrid">
</p>

---

## 📖 Overview

**Tay and Tos Accommodation** is a full-stack web application designed to provide a modern online booking experience for accommodation guests.

The platform allows users to browse available rooms, make reservations, manage bookings, and receive booking-related email notifications. Administrators can manage users, rooms, and bookings through dedicated administrative functionality.

The system follows a client-server architecture where the React frontend communicates with a Node.js/Express REST API.

---

## ✨ Features

### 👤 User Features

* 🏨 Browse available accommodation rooms
* 📅 Make room reservations
* 🔎 Look up existing bookings
* 👤 Guest booking support
* 🔐 User authentication and authorization
* 📋 View and manage booking information
* 💳 Store and manage payment-related booking information
* 📧 Receive booking confirmation emails
* 📱 Responsive interface across devices

### 👨‍💼 Administrative Features

* 👥 Manage registered users
* 📋 Manage reservations and bookings
* 🏨 Manage accommodation information
* 🔐 Protected administrative endpoints
* 📊 Administrative booking management
* 📧 Automated booking notifications

### 🔍 SEO & Web Features

* 🔎 Google Search Console verification
* 🌐 Search engine optimization support
* 📱 Responsive web design
* ⚡ Client-server REST API architecture

---

## 🏗️ System Architecture

```text
┌───────────────────────────────┐
│        React Frontend         │
│          React 18 SPA         │
└───────────────┬───────────────┘
                │
                │ HTTP / REST API
                ▼
┌───────────────────────────────┐
│       Node.js + Express       │
│            REST API           │
└───────────────┬───────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
┌──────────────┐  ┌──────────────┐
│    MySQL     │  │   SendGrid   │
│   Database   │  │    Email     │
└──────────────┘  └──────────────┘
```

### Components

| Component              | Technology            |
| ---------------------- | --------------------- |
| Frontend               | React 18              |
| Backend                | Node.js + Express 5   |
| Database               | MySQL                 |
| Database Query Builder | Knex.js               |
| Authentication         | JWT                   |
| Email                  | SendGrid              |
| API                    | REST                  |
| SEO Verification       | Google Search Console |

---

## 🛠️ Technology Stack

### Frontend

* ⚛️ **React 18**
* 🟨 **JavaScript**
* 🎨 **HTML5 / CSS3**
* 🧭 **React Router**
* 🔗 **HTTP / REST API requests**

### Backend

* 🟢 **Node.js**
* 🚂 **Express 5**
* 🔗 **REST API**
* 🔐 **JWT Authentication**
* 🗄️ **MySQL**
* 🔧 **Knex.js**

### Services

* 📧 **SendGrid** — transactional email delivery
* 🔎 **Google Search Console** — search engine verification and indexing support

---

## 📁 Project Structure

```text
TayAndTos/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   ├── package.json
│   └── ...
│
└── README.md
```

> **Note:** The exact directory structure may vary depending on the current development or deployment configuration.

---

# 🚀 Getting Started

## 📋 Prerequisites

Before running the application locally, make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* npm
* MySQL
* Git

---

## 📥 Clone the Repository

```bash
git clone https://github.com/Akpati-Lucan/TayAndTos.git
cd TayAndTos
```

---

## 📦 Install Dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd ../backend
npm install
```

---

# 🔐 Environment Variables

The application uses environment variables for configuration and sensitive credentials.

Create the appropriate `.env` files for the frontend and backend.

### Example Backend Configuration

```env
PORT=5000

DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

JWT_SECRET=your_jwt_secret

SENDGRID_API_KEY=your_sendgrid_api_key
```

> ⚠️ **Security:** Never commit `.env` files, API keys, passwords, JWT secrets, or other credentials to GitHub.

A `.gitignore` file should be configured to exclude sensitive environment files:

```gitignore
.env
.env.*
node_modules/
```

---

# 🗄️ Database Setup

The application uses **MySQL** for persistent data storage.

Create a MySQL database and configure the backend environment variables with the appropriate database credentials.

Example:

```sql
CREATE DATABASE tay_and_tos;
```

If database migrations or seed scripts are included in the project, run the corresponding commands from the `backend` directory.

For example:

```bash
cd backend
```

Then run the project's configured migration or seed commands.

---

# ▶️ Running the Application

## Start the Backend

From the backend directory:

```bash
npm start
```

The backend will start on the configured port, for example:

```text
http://localhost:5000
```

## Start the Frontend

Open another terminal and run:

```bash
cd frontend
npm start
```

The React development server will start on its configured port, commonly:

```text
http://localhost:3000
```

> ℹ️ The frontend and backend ports may vary depending on the environment configuration.

---

# 🔌 API

The backend exposes REST API endpoints used by the frontend.

API functionality includes:

| Area                 | Functionality                   |
| -------------------- | ------------------------------- |
| 🔐 Authentication    | User registration and login     |
| 👤 Users             | User management                 |
| 🏨 Rooms             | Accommodation information       |
| 📅 Bookings          | Booking creation and management |
| 🔎 Booking Lookup    | Find existing reservations      |
| 📧 Notifications     | Booking confirmation emails     |
| 👨‍💼 Administration | Administrative operations       |

The React frontend communicates with these endpoints through HTTP requests.

---

# 🚢 Deployment

The application can be deployed as two primary components:

```text
Frontend
   │
   │ HTTP / REST API
   ▼
Backend
   │
   ├── MySQL
   │
   └── SendGrid
```

### Frontend

The React single-page application can be deployed using a static hosting provider or web server.

### Backend

The Node.js/Express API can be deployed to a server or cloud platform with access to the MySQL database.

### Production Recommendations

Production deployments should:

* 🔐 Use environment variables for credentials
* 🔒 Enable HTTPS
* 🛡️ Configure CORS appropriately
* 🗄️ Secure the production database
* 📧 Configure production email credentials
* 🚫 Never expose secrets in frontend code
* 📊 Monitor application errors and availability

---

# 🛡️ Security

The application incorporates several security practices, including:

* 🔐 JWT-based authentication
* 🛡️ Protected administrative endpoints
* 🔑 Environment-based credential configuration
* ✅ Server-side API validation
* 🌐 CORS configuration
* 🔒 Secure handling of authentication credentials
* 🚫 Secrets excluded from version control

> **Important:** Secrets and credentials should never be committed to the repository.

---

# 🔮 Future Improvements

Potential future improvements include:

* 💳 Online payment processing
* 🔔 Automated booking reminders
* 🏨 Advanced room availability management
* ⭐ Customer reviews and ratings
* 📊 Improved administrative analytics
* 🤖 Automated deployment pipelines
* 🔍 Expanded search engine optimization
* 📱 Improved mobile experience
* 📈 Advanced booking and revenue reporting
* 🔔 Real-time booking notifications

---

# 👨‍💻 Author

Developed for **Tay and Tos Accommodation** in **Ado-Ekiti, Nigeria**.

### Lucan Akpati

💻 GitHub: **[Akpati-Lucan](https://github.com/Akpati-Lucan)**

---

## 📄 License

This project is developed for **Tay and Tos Accommodation**.

All rights reserved unless otherwise specified by the project owner.
