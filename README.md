![image](https://github.com/user-attachments/assets/9cb43c74-0341-4a79-9e1a-4f2fde269e9e)

# Task Management API

This project is a RESTful API for a task management system, built with Node.js, Express, and TypeScript. It uses AWS Cognito for user authentication and Microsoft SQL Server for data storage.

## Backend Technologies Used

- Node.js
- Express.js
- TypeScript
- Sequelize ORM
- AWS Cognito for authentication
- Microsoft SQL Server Express 2022

## Backend Technologies Used
- React
- TypeScript
- Axios
- Material UI

## Prerequisites

- Node.js (v14 or later)
- npm
- Microsoft SQL Server Express 2022
- AWS account

## Setup

### Database Setup

1. Install Microsoft SQL Server Express 2022
2. Open SQL Server Configuration Manager
3. Enable TCP/IP:
   * Expand "SQL Server Network Configuration"
   * Click on "Protocols for SQLEXPRESS"
   * Right-click on TCP/IP and select "Enable"
4. Set the TCP dynamic port:
   * Right-click on TCP/IP and select "Properties"
   * Go to the "IP Addresses" tab
   * Scroll to IPALL and set "TCP Dynamic Ports" to 0
5. Enable SQL Server Browser:
   * Click on "SQL Server Services"
   * Right-click on "SQL Server Browser" and select "Properties"
   * Set "Start Mode" to "Automatic"
   * Click "Apply", then "OK"
   * Right-click on "SQL Server Browser" again and select "Start"
6. Restart the SQL Server service for changes to take effect

### AWS Cognito Setup

1. Sign in to the AWS Management Console
2. Navigate to Amazon Cognito
3. Create a new User Pool
4. Note down the User Pool ID and App Client ID

### Project Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   DB_HOST=<your-sql-server-host>
   DB_USER=<your-sql-server-username>
   DB_PASSWORD=<your-sql-server-password>
   DB_NAME=<your-database-name>
   DB_ENCRYPT=false
   DB_TRUST_SERVER_CERTIFICATE=true
   COGNITO_USER_POOL_ID=<your-cognito-user-pool-id>
   COGNITO_APP_CLIENT_ID=<your-cognito-app-client-id>
   AWS_REGION=<your-aws-region>
   AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
   AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key-id>
   ```

4. Run database migrations:
   ```
   npx sequelize-cli db:migrate
   ```

5. Start the server:
   ```
   npm start
   ```

## API Endpoints

- POST /api/auth/signup - Register a new user
- POST /api/auth/signin - Sign in a user
- POST /api/auth/confirm - Manually confirm registered user
- GET /api/projects - Get all projects (authenticated)
- POST /api/projects - Create a new project (authenticated)
- GET /api/projects/:id - Get a specific project (authenticated)
- PUT /api/projects/:id - Update a project (authenticated)
- DELETE /api/projects/:id - Delete a project (authenticated)
- GET /api/tasks - Get all tasks (authenticated)
- POST /api/tasks - Create a new task (authenticated)
- GET /api/tasks/:id - Get a specific task (authenticated)
- PUT /api/tasks/:id - Update a task (authenticated)
- DELETE /api/tasks/:id - Delete a task (authenticated)

## Authentication

This project uses AWS Cognito for user authentication. When making requests to authenticated endpoints, include the Cognito access token in the Authorization header:

```
Authorization: Bearer <your-access-token>
```
If you do not wish to use your real Email or Phone make sure to confirm your user via Postman using the following url:
```
http://localhost:3000/api/auth/confirm
```
pass this body:
```
{
  "username": "<registered-user-name>"
}
```
