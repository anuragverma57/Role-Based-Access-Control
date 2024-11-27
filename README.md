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

---

### Admin-Specific Features

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

| **Method** | **Endpoint**                | **Protected** | **Roles Allowed** | **Description**          |
| ---------- | --------------------------- | ------------- | ----------------- | ------------------------ |
| **POST**   | `/api/auth/register`        | No            | -                 | Register a new user      |
| **POST**   | `/api/auth/login`           | No            | -                 | Login and obtain a token |
| **GET**    | `/api/users/profile`        | Yes           | All               | Fetch user profile       |
| **PATCH**  | `/api/users/update-profile` | Yes           | All               | Update name or password  |
| **GET**    | `/api/users`                | Yes           | Admin, Moderator  | Fetch all users          |
| **GET**    | `/api/users/:id`            | Yes           | Admin, Moderator  | Fetch a user by ID       |
| **PATCH**  | `/api/users/change-role`    | Yes           | Admin             | Update a user's role     |
