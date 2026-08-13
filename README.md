Tay and Tos Accommodation

A full-stack room booking web application for Tay and Tos Accommodation in Ado-Ekiti, Nigeria.

System Architecture

Components: React 18 SPA (frontend) + Node.js/Express 5 API (backend) + MySQL (database) + SendGrid (email). The frontend communicates with the backend over HTTP API requests.

Features
🏨 Browse available accommodation rooms
📅 Room booking and reservation management
👤 Guest booking support
🔐 User authentication and authorization
📋 Booking confirmation and management
💳 Payment information and booking confirmation
📧 Email notifications through SendGrid
👨‍💼 Admin dashboard for managing users and bookings
📱 Responsive web interface
🔎 Google search engine verification and SEO support
Technology Stack
Frontend
React 18
JavaScript
HTML5 / CSS3
React Router
HTTP API requests
Backend
Node.js
Express 5
REST API
JWT authentication
MySQL
Knex.js
Services
SendGrid — transactional email
Google Search Console — search engine verification
Project Structure
TayAndTos/
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

The exact directory structure may vary depending on the current deployment configuration.

Getting Started
Prerequisites

Make sure you have the following installed:

Node.js
npm
MySQL
Git
Clone the Repository
git clone https://github.com/Akpati-Lucan/TayAndTos.git
cd TayAndTos
Install Dependencies

Install the frontend dependencies:

cd frontend
npm install

Install the backend dependencies:

cd ../backend
npm install
Environment Variables

The application uses environment variables for configuration and sensitive credentials.

Create the appropriate .env files for the frontend and backend.

Example backend configuration:

PORT=5000
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key

Do not commit .env files, API keys, passwords, or other secrets to GitHub.

Database

Create a MySQL database and configure the backend environment variables with the appropriate database credentials.

If database migrations or seed scripts are included in the project, run the corresponding commands from the backend directory.

Running the Application

Start the backend:

npm start

Then start the frontend from its directory:

npm start

The frontend and backend ports may vary depending on the environment configuration.

API

The backend provides REST API endpoints for functionality such as:

User authentication
User management
Room information
Booking creation
Booking lookup
Booking management
Administrative operations

The frontend consumes these endpoints to provide the booking interface.

Deployment

The application can be deployed as two components:

Frontend — React single-page application
Backend — Node.js/Express API connected to MySQL

Production deployments should use environment variables for all credentials and service configuration.

Security

The application includes security considerations such as:

JWT-based authentication
Protected administrative endpoints
Environment-based credential configuration
Server-side API validation
CORS configuration
Secure handling of authentication credentials

Secrets and credentials should never be committed to the repository.

Future Improvements

Potential future improvements include:

Online payment processing
Automated booking reminders
Advanced room availability management
Customer reviews and ratings
Improved administrative analytics
Automated deployment pipelines
Expanded search engine optimization
Improved mobile experience
Author

Developed for Tay and Tos Accommodation in Ado-Ekiti, Nigeria.

GitHub: Akpati-Lucan