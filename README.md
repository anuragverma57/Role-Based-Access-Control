# RBAC System Backend

This project implements a secure **Authentication**, **Authorization**, and **Role-Based Access Control (RBAC)** system using **Node.js**, **Express**, and **MongoDB**. It defines distinct roles (**Admin**, **Moderator**, **User**) and provides functionalities specific to each role while ensuring secure access to APIs.

---

## Features

### Authentication

- **Register a New User**

  - **Endpoint:** `POST /api/auth/register`
  - **Description:** Registers a new user with the default role `user`.
  - **Request Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "securepassword"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "User registered successfully",
      "userId": "abc123",
      "role": "user",
      "token": "<JWT_TOKEN>"
    }
    ```

- **Login**
  - **Endpoint:** `POST /api/auth/login`
  - **Description:** Authenticates a user and provides a JWT token for session handling.
  - **Request Body:**
    ```json
    {
      "email": "john@example.com",
      "password": "securepassword"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "User Logged In successfully",
      "id": "abc123",
      "role": "user",
      "token": "<JWT_TOKEN"
    }
    ```

---

### Profile Management

- **Get User Profile**

  - **Endpoint:** `GET /api/users/profile`
  - **Description:** Retrieves the logged-in user's profile details.
  - **Protected:** Yes (Accessible to all authenticated users).
  - **Response:**
    ```json
    {
      "_id": "1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
    ```

- **Update User Name or Password**

  - **Endpoint:** `PATCH /api/users/update-profile`
  - **Description:** Allows a user to update their `name` or `password`. Users cannot modify their role through this endpoint.
  - **Protected:** Yes (Accessible to all authenticated users).
  - **Request Body:**
    ```json
    {
      "name": "Jane Doe",
      "password": "newsecurepassword"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Profile updated successfully",
      "user": {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "moderator"
      }
    }
    ```

- **Change Status as Active/Inactive**

  - **Endpoint:** `PATCH /api/users/status-change`
  - **Description:** Allows a user to change their `status`.
  - **Protected:** Yes (Accessible to all authenticated users).
  - **Request Body:**

    ```json
    {
      "status": "inactive"
    }
    ```

  - **Response:**
    ```json
    {
      "message": "User status updated to inactive"
    }
    ```

---

### Moderator-Specific Features

- **View All Users**

  - **Endpoint:** `GET /api/users`
  - **Description:** Retrieves a list of all users in the system.
  - **Protected:** Yes (Accessible to Admin and Moderator).
  - **Response:**
    ```json
    [
      {
        "_id": "abc123",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
      },
      {
        "_id": "def456",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "moderator"
      }
    ]
    ```

- **View a User by ID**

  - **Endpoint:** `GET /api/users/:id`
  - **Description:** Retrieves a specific user's details by their ID.
  - **Protected:** Yes (Accessible to Admin and Moderator).
  - **Response:**
    ```json
    {
      "_id": "abc123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
    ```

- **Get User Stats**

  - **Endpoint:** `GET /api/users/stats`
  - **Description:** Retrieves stats of all the users present in the db.
  - **Protected:** Yes (Accessible to Admin and Moderator).
  - **Response:**
    ```json
    {
      "totalUsers": 9,
      "activeUsers": 8,
      "inactiveUsers": 1,
      "bannedUsers": 1,
      "UnbannedUsers": 8
    }
    ```

### Admin-Specific Features

- **Change User Role**

  - **Endpoint:** `PATCH /api/users/change-role`
  - **Description:** Allows an admin to update a user's role. Admins cannot modify other admins' roles.
  - **Protected:** Yes (Accessible to Admin only).
  - **Request Body:**
    ```json
    {
      "userId": "abc123",
      "role": "moderator"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Role updated successfully"
    }
    ```

- **Ban a User**

  - **Endpoint:** `PATCH /api/users/:id/ban`
  - **Description:** Allows an admin to ban a user. Admins cannot ban other admins.
  - **Protected:** Yes (Accessible to Admin only).
  - **Response:**
    ```json
    {
      "message": "User banned successfully"
    }
    ```

- **UnBan a User**

  - **Endpoint:** `PATCH /api/users/:id/unban`
  - **Description:** Allows an admin to unban a banned user.
  - **Protected:** Yes (Accessible to Admin only).
  - **Response:**
    ```json
    {
      "message": "User unbanned successfully"
    }
    ```

---

## Installation and Setup

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd RBAC_System
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a .env file in the root directory and add the following variables:

   ```
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-secret-key>
   ```

4. Start the server:

   ```
   npm start
   ```

## API Overview

| **Method** | **Endpoint**                | **Protected** | **Roles Allowed** | **Description**               |
| ---------- | --------------------------- | ------------- | ----------------- | ----------------------------- |
| **POST**   | `/api/auth/register`        | No            | -                 | Register a new user           |
| **POST**   | `/api/auth/login`           | No            | -                 | Login and obtain a token      |
| **GET**    | `/api/users/profile`        | Yes           | All               | Fetch user profile            |
| **PATCH**  | `/api/users/update-profile` | Yes           | All               | Update name or password       |
| **PATCH**  | `/api/users/change-status`  | Yes           | All               | change status Active/InActive |
| **GET**    | `/api/users`                | Yes           | Admin, Moderator  | Fetch all users               |
| **GET**    | `/api/users/:id`            | Yes           | Admin, Moderator  | Fetch a user by ID            |
| **GET**    | `/api/users/stats`          | Yes           | Admin, Moderator  | Get Stats of all users in DB  |
| **PATCH**  | `/api/users/change-role`    | Yes           | Admin             | Update a user's role          |
| **PATCH**  | `/api/users/:id/ban`        | Yes           | Admin             | Ban a user                    |
| **PATCH**  | `/api/users/:id/unban`      | Yes           | Admin             | Unban a banned user           |
