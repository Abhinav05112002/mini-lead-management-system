# Mini Lead Management System

A full-stack Lead Management System built using:

- Node.js
- Express.js
- PostgreSQL
- React.js
- JWT Authentication

The system allows Managers to create and assign leads to Agents while providing role-based access control, activity tracking, dashboard analytics, and email notifications.

## Features

### Authentication

- User Registration
- User Login
- JWT Authentication
- Role Based Authorization

### Lead Management

- Create Lead
- Update Lead
- Delete Lead
- Get Lead Details
- Lead Listing

### Assignment Logic

- Least Loaded Agent Assignment

### Dashboard

- Lead Statistics
- Status Metrics

### Activity Logs

- Lead Created
- Lead Updated
- Lead Assigned
- Status Changed

### Notifications

- Email Notification using Nodemailer

## Tech Stack

### Backend

- Node.js
- Express.js
- PostgreSQL
- JWT
- Bcrypt
- Nodemailer

### Frontend

- React.js
- Bootstrap
- Axios
- React Router

### Database

- PostgreSQL

## Folder Structure

project-root

├── backend
├── frontend
├── database
├── docs
└── README.md

backend/src

├── config
├── controllers
├── middleware
├── routes
├── services
├── validations
├── utils
├── app.js
└── server.js

## Database Setup

Create PostgreSQL database:

lead_management_db

Execute SQL scripts:

database/schema.sql

Tables:

1. users
2. leads
3. activity_logs

## Environment Variables

Create:

backend/.env

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=lead_management_db

JWT_SECRET=my_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start server:

```bash
npm run dev
```

Server runs on:

```text
http://localhost:5000
```

## Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start application:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## API Endpoints

### Authentication

POST /api/auth/register

POST /api/auth/login

### Leads

POST /api/leads

GET /api/leads

GET /api/leads/:id

PUT /api/leads/:id

DELETE /api/leads/:id

### Dashboard

GET /api/dashboard/stats

### Activity

GET /api/activity

## Roles

### Admin

- Full Access

### Manager

- Create Lead
- Update Lead
- Delete Lead
- View Leads

### Agent

- View Assigned Leads
- Update Lead Status

## Lead Assignment Strategy

Least Loaded Agent Algorithm

Steps:

1. Find all users with AGENT role.
2. Count leads assigned to each agent.
3. Select agent with minimum lead count.
4. Assign lead automatically.

Benefits:

- Fair Distribution
- Better Scalability
- Reduced Workload Imbalance

## Assumptions

- Managers create leads.
- Agents handle assigned leads.
- Admin manages the entire system.
- Email notifications are sent on lead assignment.
- Authentication is JWT-based.

## Future Improvements

- Redis Caching
- Background Job Queue
- WebSocket Notifications
- Docker Support
- Swagger Documentation
- Unit Testing
- CI/CD Pipeline

## Additional Documents

- docs/database-design.md
- docs/ai-usage.md

