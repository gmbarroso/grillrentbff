# GrillRent BFF

GrillRent BFF (Backend For Frontend) is a middleware layer that serves as an intermediary between the frontend and the backend services. It handles requests from the frontend, processes them, and forwards them to the appropriate backend services.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [User Routes](#user-routes)
  - [Booking Routes](#booking-routes)
  - [Resource Routes](#resource-routes)
- [Middleware](#middleware)
- [Validation](#validation)
- [Environment Variables](#environment-variables)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/grillrentbff.git
   ```

2. Navigate to the project directory:

   ```sh
   cd grillrentbff
   ```

3. Install the dependencies:

   ```sh
   npm install
   ```

## Usage

1. Start the server:

   ```sh
   npm start
   ```

2. The server will run on `http://localhost:3001`.

## API Endpoints

### User Routes

- **Register User**
  - **Method:** POST
  - **URL:** `/users/register`
  - **Headers:** `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123",
      "apartment": "101",
      "block": 1
    }
    ```

- **User Login**
  - **Method:** POST
  - **URL:** `/users/login`
  - **Headers:** `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "apartment": "101",
      "block": 1,
      "password": "password123"
    }
    ```

- **Get User Profile**
  - **Method:** GET
  - **URL:** `/users/profile`
  - **Headers:** `Authorization: Bearer <token>`

- **Update User Profile**
  - **Method:** PUT
  - **URL:** `/users/profile`
  - **Headers:**
    - `Content-Type: application/json`
    - `Authorization: Bearer <token>`
  - **Body:**
    ```json
    {
      "name": "John Doe Updated",
      "email": "john.updated@example.com",
      "password": "newpassword123"
    }
    ```

- **Get All Users**
  - **Method:** GET
  - **URL:** `/users`
  - **Headers:** `Authorization: Bearer <token>`

- **Delete User**
  - **Method:** DELETE
  - **URL:** `/users/:id`
  - **Headers:** `Authorization: Bearer <token>`

### Booking Routes

- **Create Booking**
  - **Method:** POST
  - **URL:** `/bookings`
  - **Headers:**
    - `Content-Type: application/json`
    - `Authorization: Bearer <token>`
  - **Body:**
    ```json
    {
      "resourceId": "resource-id",
      "userId": "user-id",
      "startTime": "2025-02-22T10:00:00.000Z",
      "endTime": "2025-02-22T12:00:00.000Z"
    }
    ```

- **Get All Bookings**
  - **Method:** GET
  - **URL:** `/bookings`
  - **Headers:** `Authorization: Bearer <token>`
  - **Query Params:**
    - `page`: Page number (default: 1)
    - `limit`: Number of items per page (default: 10)
    - `sort`: Field to sort by (default: `startTime`)
    - `order`: Sort order (`ASC` or `DESC`, default: `ASC`)

- **Get Bookings by User**
  - **Method:** GET
  - **URL:** `/bookings/user/:userId`
  - **Headers:** `Authorization: Bearer <token>`
  - **Query Params:**
    - `page`: Page number (default: 1)
    - `limit`: Number of items per page (default: 10)
    - `sort`: Field to sort by (default: `startTime`)
    - `order`: Sort order (`ASC` or `DESC`, default: `ASC`)

- **Delete Booking**
  - **Method:** DELETE
  - **URL:** `/bookings/:id`
  - **Headers:** `Authorization: Bearer <token>`

- **Check Availability**
  - **Method:** GET
  - **URL:** `/bookings/availability/:resourceId`
  - **Headers:** `Authorization: Bearer <token>`
  - **Query Params:**
    - `startTime`: Start time in ISO 8601 format
    - `endTime`: End time in ISO 8601 format

### Resource Routes

- **Get All Resources**
  - **Method:** GET
  - **URL:** `/resources`
  - **Headers:** `Authorization: Bearer <token>`

## Middleware

- **CORS Middleware:** Allows cross-origin requests.
- **Request ID Middleware:** Adds a unique request ID to each request.
- **Logging Middleware:** Logs information about each request.
- **Rate Limit Middleware:** Limits the rate of requests to prevent abuse.
- **Error Handler Middleware:** Handles errors and sends appropriate responses.

## Validation

Validation is performed using Joi schemas to ensure that the data being sent to the API meets the required criteria.

## Environment Variables

- `API_URL`: The base URL of the backend API.
- `USE_MOCKS`: A flag to indicate whether to use mock data.
