# CampusCare – College Complaint Management System

A web-based complaint management platform designed to improve communication between students and college administration.

CampusCare provides a centralized system where students can register, submit complaints, track their progress, and access their complaint history. Staff members can review complaints, manage requests, update statuses, and provide resolutions.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Objectives](#objectives)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [System Architecture](#system-architecture)
6. [Project Structure](#project-structure)
7. [Installation and Setup](#installation-and-setup)
8. [Environment Configuration](#environment-configuration)
9. [Running the Application](#running-the-application)
10. [API Documentation](#api-documentation)
11. [Database Design](#database-design)
12. [Authentication and Security](#authentication-and-security)
13. [Complaint Workflow](#complaint-workflow)
14. [Future Improvements](#future-improvements)
15. [License](#license)

---

## 1. Project Overview

Traditional college complaint-handling processes can be time-consuming and difficult to track.

CampusCare aims to simplify this process through a centralized digital platform.

Students can submit complaints related to:

- Academic matters
- Infrastructure
- Hostel facilities
- Library services
- Canteen facilities
- Administration
- Examination-related issues
- Other college-related concerns

The system stores complaint records in MongoDB and provides APIs for authentication, complaint submission, retrieval, and status management.

## 2. Objectives

- Provide students with an accessible complaint submission platform.
- Centralize complaint records in a database.
- Improve transparency through complaint status tracking.
- Enable staff to manage complaints efficiently.
- Implement secure authentication and role-based authorization.
- Reduce manual administrative effort.

## 3. Features

### Student Features

- Student account registration.
- Secure login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Complaint submission.
- Complaint categorization.
- Complaint priority selection.
- Personal complaint history.
- Individual complaint retrieval.

### Staff Features

- Role-based access control.
- View all submitted complaints.
- Filter complaints by status, category, and priority.
- Update complaint statuses.
- Add complaint resolution information.

### System Features

- RESTful API architecture.
- MongoDB Atlas integration.
- Express.js backend.
- Mongoose data modelling.
- JWT authentication middleware.
- Centralized error handling.
- Environment-based configuration.

## 4. Technology Stack

| Category | Technology |
|---|---|
| Frontend | HTML5 |
| Styling | CSS3 |
| Client-side scripting | JavaScript |
| Backend | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JSON Web Token |
| Password hashing | bcryptjs |
| Development environment | GitHub Codespaces |
| Development server | Nodemon |
| Version control | Git and GitHub |

## 5. System Architecture

CampusCare follows a client-server architecture.

```text
             STUDENT / STAFF
                    |
                    v
             FRONTEND LAYER
              HTML / CSS / JS
                    |
                    v
              EXPRESS SERVER
                    |
          +---------+---------+
          |                   |
          v                   v
    AUTHENTICATION        COMPLAINT
       ROUTES              ROUTES
          |                   |
          v                   v
    AUTH CONTROLLER     COMPLAINT
                       CONTROLLER
          |                   |
          +---------+---------+
                    |
                    v
             AUTH MIDDLEWARE
               JWT / RBAC
                    |
                    v
               MONGOOSE
                    |
                    v
              MONGODB ATLAS
                /       \
               v         v
             USERS   COMPLAINTS
```

### Request Flow

1. A user interacts with the frontend.
2. The frontend sends an HTTP request to the Express server.
3. Authentication middleware verifies protected requests.
4. Controllers process the application logic.
5. Mongoose communicates with MongoDB Atlas.
6. The server returns a JSON response.

## 6. Project Structure

```text
CollegeComplaintSystem/
│
├── public/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── student-dashboard.html
│   ├── submit-complaint.html
│   ├── my-complaints.html
│   ├── staff-dashboard.html
│   │
│   ├── css/
│   │   └── styles.css
│   │
│   └── js/
│       ├── main.js
│       └── register.js
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── complaintController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Complaint.js
│   │
│   ├── routes/
│   │   ├── authRoute.js
│   │   └── complaintRoute.js
│   │
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## 7. Installation and Setup

### Prerequisites

Make sure the following are available:

- Node.js 20 or later
- npm
- Git
- MongoDB Atlas account

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/CollegeComplaintSystem.git
```

Navigate into the project:

```bash
cd CollegeComplaintSystem
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure MongoDB Atlas

1. Create a MongoDB Atlas account.
2. Create a cluster.
3. Create a database user.
4. Configure network access.
5. Obtain your MongoDB connection string.
6. Use `campuscare` as the database name.

### Step 4: Configure Environment Variables

Create a `.env` file in the project root.

Add:

```env
PORT=3000

MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/campuscare?retryWrites=true&w=majority

JWT_SECRET=YOUR_GENERATED_SECRET

JWT_EXPIRES_IN=1d
```

Replace the placeholders with your actual credentials.

Generate a secure JWT secret using:

```bash
openssl rand -base64 32
```

**Security:** Never upload `.env` to GitHub or share your database credentials and JWT secret.

## 8. Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The application runs on:

```text
http://localhost:3000
```

### Health Check

Visit:

```text
http://localhost:3000/api/health
```

A successful response indicates that the server is running and MongoDB is connected.

Example:

```json
{
  "success": true,
  "message": "CampusCare server health status",
  "server": "Running",
  "database": "Connected",
  "databaseName": "campuscare"
}
```

## 9. API Documentation

Base URL:

```text
http://localhost:3000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a student | Public |
| POST | `/auth/login` | Authenticate a user | Public |
| GET | `/auth/me` | Retrieve authenticated user profile | Authenticated |

### Complaint Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/complaints` | Submit a complaint | Student |
| GET | `/complaints/my` | Retrieve personal complaints | Student |
| GET | `/complaints` | Retrieve all complaints | Staff |
| GET | `/complaints/:id` | Retrieve complaint details | Student / Staff |
| PATCH | `/complaints/:id/status` | Update complaint status | Staff |

### Authentication Header

Protected endpoints require a JWT:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Example: Student Registration

**POST** `/api/auth/register`

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "studentId": "STU001",
  "department": "Computer Science"
}
```

### Example: Student Login

**POST** `/api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

The response contains a JWT and user information.

### Example: Submit a Complaint

**POST** `/api/complaints`

```json
{
  "title": "Library Wi-Fi connectivity issue",
  "description": "The Wi-Fi connection frequently disconnects in the college library.",
  "category": "Library",
  "priority": "Medium"
}
```

Include the JWT in the Authorization header.

### Example: Update Complaint Status

**PATCH** `/api/complaints/COMPLAINT_ID/status`

```json
{
  "status": "Resolved",
  "resolution": "The network connectivity issue has been fixed."
}
```

This endpoint requires an authenticated staff account.

## 10. Database Design

CampusCare currently uses two primary MongoDB collections.

### Users Collection

Stores student and staff account information.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique user identifier |
| `fullName` | String | Full name |
| `email` | String | Unique email |
| `password` | String | Hashed password |
| `role` | String | Student or staff |
| `studentId` | String | Student identifier |
| `department` | String | Academic department |
| `isActive` | Boolean | Account status |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Update timestamp |

### Complaints Collection

Stores complaint information and progress.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique complaint identifier |
| `student` | ObjectId | Reference to submitting student |
| `title` | String | Complaint title |
| `description` | String | Complaint description |
| `category` | String | Complaint category |
| `priority` | String | Low, Medium, or High |
| `status` | String | Current complaint status |
| `assignedTo` | ObjectId | Assigned staff member |
| `resolution` | String | Resolution details |
| `resolvedAt` | Date | Resolution timestamp |
| `createdAt` | Date | Submission timestamp |
| `updatedAt` | Date | Update timestamp |

## 11. Authentication and Security

CampusCare implements the following security mechanisms:

**Password Hashing**

Passwords are hashed using bcryptjs before storage.

**JWT Authentication**

JSON Web Tokens are generated after successful login and verified for protected API requests.

**Role-Based Authorization**

The application distinguishes between student and staff roles.

Students can submit complaints and access their own complaint records. Staff endpoints require staff authorization.

**Environment Configuration**

Sensitive configuration values are stored in environment variables rather than hardcoded in application files.

**Database Security**

MongoDB Atlas provides database access management and network access controls.

## 12. Complaint Workflow

The complaint lifecycle is designed around the following statuses:

```text
       SUBMITTED
           |
           v
       UNDER REVIEW
           |
           v
       IN PROGRESS
           |
           v
        RESOLVED
```

Complaints may also be marked as `REJECTED`.

Staff members can update complaint statuses and provide resolution information.

## 13. Future Improvements

Potential enhancements include:

- Email notifications for complaint updates.
- Department-based complaint assignment.
- File and image attachments.
- Advanced complaint search and filtering.
- Dashboard analytics and reporting.
- Complaint escalation mechanisms.
- Student feedback and satisfaction ratings.
- Staff activity and audit logs.
- Password reset functionality.
- Automated API testing.
- Improved responsive design and accessibility.

## 14. License

This project is developed for academic and educational purposes.

A formal open-source license can be added before public distribution.

---

## CampusCare

**College Complaint Management System**

A centralized digital platform designed to improve student communication, complaint tracking, and administrative transparency.

**Technology:** Node.js · Express.js · MongoDB Atlas · HTML · CSS · JavaScript

**Repository:** [CollegeComplaintSystem](https://github.com/YOUR_USERNAME/CollegeComplaintSystem)

