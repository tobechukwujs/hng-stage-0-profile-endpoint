# HNG Internship Stage 0: Dynamic Profile Endpoint

## 🚀 Project Overview

This project is the solution for the **HNG Internship Backend Task (Stage 0): Build a Dynamic Profile Endpoint**.

The goal was to create a simple RESTful API that returns personalized user data alongside a **dynamic, non-cached cat fact** fetched from a third-party API. It demonstrates core skills in API integration, environment variable management, and professional server setup with graceful error handling.

### Live Submission URL

The application is successfully deployed on Railway and accessible via this endpoint:

`https://hng-stage-0-profile-endpoint-production.up.railway.app/me`

***

## ⚙️ Technology Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Language** | JavaScript (Node.js) | Server-side execution environment. |
| **Framework** | Express.js | Minimalist framework for defining routes and middleware. |
| **HTTP Client** | Axios | Promise-based HTTP client for fetching the cat fact. |
| **Configuration**| `dotenv` | Loads environment variables from a local `.env` file. |
| **Deployment** | Railway | Cloud hosting platform for the backend service. |

***

## 📋 Required Endpoint and Response

### Endpoint

| Method | Path | Description |
| :--- | :--- | :--- |
| **GET** | `/me` | Returns profile data and a random cat fact. |

### Expected Success Response (200 OK)

The endpoint strictly adheres to the required JSON schema, ensuring the `timestamp` and `fact` fields update dynamically on every request.

```json
{
  "status": "success",
  "user": {
    "email": "tobechukwuegboh@gmail.com",
    "name": "Egboh Tobechukwu",
    "stack": "Node.js/Express"
  },
  "timestamp": "2025-10-18T23:48:54.000Z",
  "fact": "A unique, random cat fact."
}
