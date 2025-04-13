# Leave Management System

A full-stack application for managing employee leave requests in an organization.

## Features

- **User Authentication**: Secure login system with role-based access control
- **Leave Request Management**: Employees can submit leave requests
- **Automatic Manager Assignment**: System assigns managers to review leave requests
- **Leave Status Tracking**: Track pending, approved, and rejected leave requests
- **Responsive UI**: Modern interface built with React and Material UI

## Tech Stack

### Frontend
- React with TypeScript
- Material UI for components
- JWT for authentication

### Backend
- Spring Boot for RESTful API
- Spring Security for authentication and authorization
- JPA/Hibernate for database operations
- MySQL database

## Getting Started

### Prerequisites
- Node.js (v14+)
- Java JDK 17/21
- MySQL

### Installation

#### Backend (Spring Boot)
1. Navigate to the `leavemanagement` directory
2. Configure the database connection in `src/main/resources/application.properties`
3. Run the backend with Maven:
   ```
   ./mvnw spring-boot:run
   ```
   (The server will start on port 8081)

#### Frontend (React)
1. Navigate to the `frontend` directory
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend:
   ```
   npm start
   ```
   (The application will be available at http://localhost:3001)

## API Endpoints

- **POST /api/auth/login**: Authenticate user
- **POST /api/request-leave**: Submit leave request
- **POST /api/simple-leave-request**: Submit leave request (no authentication)
- **GET /api/pending-leaves**: Get all pending leave requests
- **PUT /api/leave/{requestId}/status**: Update leave request status
- **GET /api/employee/{employeeId}/leaves**: Get employee's leave requests

## Usage

1. Login with your credentials
2. From the dashboard, submit a leave request with a reason
3. Managers can view and approve/reject pending requests
4. Employees can view the status of their requests

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributors

- Ashna Manowar 