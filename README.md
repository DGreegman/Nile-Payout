# Nile Payout System - Technical Requirements Document

## 1. Overview

This document outlines the technical requirements and architecture for the Nile Payout System. This backend service is designed to manage vendor payouts for an e-commerce platform. It handles user (who are also vendors) and order management, calculates payouts based on completed orders, and secures its endpoints using JWT authentication.

The system is built with Node.js, Express, and TypeScript, following best practices for code structure, validation, and error handling to ensure clarity, scalability, and maintainability.

## 2. Features

### 2.1. User (Vendor) Management
- **User Registration (as Vendor):** Allows for the registration of new users who also act as vendors. Each user must have a unique email address.
  - **Attributes:** `name`, `email`, `password`, `bank_account`, `store_name`.

### 2.2. Order Management
- **Create Order:** Allows for the creation of new orders associated with a specific user (vendor). Each order must have a unique `order_id`.
  - **Attributes:** `order_id`, `amount`, `status` (enum: `pending`, `completed`), `timestamp`, `vendor` (reference to User ID).

### 2.3. Payout Calculation
- **Get Payout Summary:** Provides an endpoint to calculate and retrieve a detailed payout summary for a given user (vendor).
  - The calculation only includes orders with a `completed` status.
  - A platform fee of 5% is applied to the total amount of completed orders.
  - The summary includes the vendor's store name, the total count of completed orders, the gross total amount, the calculated platform fee, and the final net payout amount.

### 2.4. Authentication
- **JWT-Based Security:** Endpoints are secured using JSON Web Tokens.
- **User Registration:** A public endpoint for new users (vendors) to register with their details.
- **User Login:** A public endpoint for registered users (vendors) to log in and receive a JWT.

### 2.5. API Documentation
- **Swagger (OpenAPI):** The API is fully documented using Swagger. The interactive documentation is available via a dedicated endpoint.

### 2.6. Health Check
- **API Health:** A public endpoint to check the operational status of the API.

### 2.7. Email Notifications
- **Payout Summary Email:** When a payout is calculated, a PDF summary is generated and sent to the vendor's registered email address. The PDF includes a courtesy message.

## 3. Technical Stack

- **Backend Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (with Mongoose as the ODM)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`)
- **Password Hashing:** `bcryptjs`
- **Validation:** `express-validator`
- **API Documentation:** `swagger-ui-express`, `swagger-jsdoc`
- **Development Server:** `ts-node-dev`
- **PDF Generation:** `pdfkit`
- **Email Sending:** `nodemailer`

## 4. Project Structure

The project follows a feature-first, separation of concerns pattern to ensure code is organized, modular, and easy to maintain.

```
src/
├── config/         # Environment variables and configuration
├── controllers/    # Handles request/response logic, calls services
├── docs/           # Swagger definition and setup
├── middleware/     # Express middleware (auth, validation, error handling)
├── models/         # Mongoose schemas and data models
├── routes/         # API route definitions and Swagger annotations
├── services/       # Core business logic
└── utils/          # Utility classes and functions (e.g., custom errors, pdf generation, email sender)
```

## 5. API Endpoints

The base URL for the API is `http://localhost:3000`.

---

### 5.1. Authentication

**POST** `/auth/register`
- **Description:** Registers a new user who also acts as a vendor.
- **Authentication:** None.
- **Request Body:**
  ```json
  {
    "name": "DenimMuse",
    "email": "contact@denimmuse.com",
    "password": "securepassword123",
    "bank_account": "1234567890",
    "store_name": "DenimMuse"
  }
  ```
- **Validation:**
  - `name`: Required.
  - `email`: Must be a valid email format.
  - `password`: Must be at least 6 characters long.
  - `bank_account`: Required.
  - `store_name`: Required.
- **Success Response (201):**
  ```json
  {
    "user": { ... },
    "token": "jwt.token.string"
  }
  ```
- **Error Responses:** `400` (Invalid Input), `500` (Server Error).

**POST** `/auth/login`
- **Description:** Authenticates a user (vendor) and returns a JWT.
- **Authentication:** None.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "user": { ... },
    "token": "jwt.token.string"
  }
  ```
- **Error Responses:** `400` (Invalid Input), `401` (Invalid Credentials), `500` (Server Error).

---

### 5.2. Orders

**POST** `/orders`
- **Description:** Creates a new order for a user (vendor).
- **Authentication:** JWT Bearer Token required.
- **Request Body:**
  ```json
  {
    "order_id": "ORD-12345",
    "amount": 25000,
    "status": "completed",
    "vendor": "60d5f2c9c3b3c3b3c3b3c3b3" // User ID
  }
  ```
- **Validation:** `order_id`, `amount`, and `vendor` are required. `amount` must be a positive number.
- **Success Response (201):** Returns the created order object.
- **Error Responses:** `400` (Invalid Input), `401` (Unauthorized), `500` (Server Error).

---

### 5.3. Payouts

**GET** `/payouts/{vendorId}`
- **Description:** Calculates and retrieves the payout summary for a specific user (vendor).
- **Authentication:** JWT Bearer Token required.
- **URL Parameters:**
  - `vendorId`: The ID of the user (vendor).
- **Success Response (200):**
  ```json
  {
    "vendor": "DenimMuse",
    "total_orders": 4,
    "total_amount": 85000,
    "platform_fee": 4250,
    "net_payout": 80750
  }
  ```
- **Error Responses:** `401` (Unauthorized), `404` (Vendor Not Found), `500` (Server Error).

---

### 5.4. Health Check

**GET** `/health`
- **Description:** Checks the operational status of the API.
- **Authentication:** None.
- **Success Response (200):**
  ```json
  {
    "status": "UP",
    "timestamp": "2023-10-27T10:00:00.000Z"
  }
  ```

## 6. Getting Started

### 6.1. Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)
- A running instance of [MongoDB](https://www.mongodb.com/)

### 6.2. Installation & Setup
1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd nile-payout-system
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables. Replace the placeholder values with your actual configuration.
    ```env
    # Your MongoDB connection string
    MONGO_URI=mongodb://localhost:27017/nile-payout-system

    # A strong, secret string for signing JWTs
    JWT_SECRET=your_super_secret_jwt_key

    # Email service configuration for sending payout summaries
    EMAIL_HOST=smtp.example.com
    EMAIL_PORT=587
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_password
    ```

### 6.3. Running the Application
1.  **Start the development server:**
    ```bash
    npm start
    ```
2.  The server will start on `http://localhost:3000`.

### 6.4. Accessing API Documentation
Once the server is running, the interactive Swagger documentation can be accessed at:
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## 7. Deployment to Vercel

This application can be deployed to Vercel as a serverless function. Vercel will automatically detect the `vercel.json` file and configure the deployment.

### 7.1. Prerequisites for Vercel Deployment
- A [Vercel account](https://vercel.com/signup)
- The [Vercel CLI](https://vercel.com/download) installed globally (`npm i -g vercel`)

### 7.2. Deployment Steps
1.  **Login to Vercel CLI:**
    ```bash
    vercel login
    ```
2.  **Deploy your project:**
    Navigate to your project's root directory (`nile-payout-system`) in your terminal and run:
    ```bash
    vercel
    ```
    Follow the prompts. Vercel will detect your `vercel.json` and `package.json` and build your project.

3.  **Configure Environment Variables on Vercel:**
    **Crucially**, your `.env` file is not deployed to Vercel. You must add your environment variables (e.g., `MONGO_URI`, `JWT_SECRET`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`) directly in your Vercel project settings:
    - Go to your Vercel Dashboard.
    - Select your project.
    - Navigate to **Settings > Environment Variables**.
    - Add each variable with its corresponding value.

4.  **Database Connection:** Ensure your MongoDB instance is publicly accessible or configured to allow connections from Vercel's IP ranges (if you're using a cloud-hosted MongoDB like MongoDB Atlas).

After successful deployment, Vercel will provide you with a unique URL for your API.

## 8. Error Handling & Validation

- **Centralized Error Handling:** The application uses a dedicated `errorHandler` middleware to catch and process all errors, ensuring consistent error responses. The `AppError` class is used for handling expected operational errors (e.g., "Vendor not found").
- **Input Validation:** Incoming request data is validated using `express-validator`. Validation rules are defined separately for each feature, and a `validate` middleware checks for errors before the request reaches the controller, preventing invalid data from entering the business logic.