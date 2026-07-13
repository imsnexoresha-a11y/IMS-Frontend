# Backend Integration Guide for the Student Module

This document outlines the architecture of the frontend API layer and provides a quick checklist for integrating this React frontend with the production backend.

## 1. The Toggle Switch (`USE_MOCK`)
The entire frontend is currently operating on dummy data via an isolated API layer. 
To switch the application to live backend endpoints:
1. Open `src/api/mockHelpers.js`
2. Change `export const USE_MOCK = true;` to `false`.

Once set to `false`, the frontend immediately stops using the `mockData.js` file and routes all HTTP traffic through Axios to your server.

## 2. Environment Variables
The application expects an environment variable for the backend URL.
1. Create or open the `.env` file in the root of the Frontend directory.
2. Update the variable: `VITE_API_BASE_URL=http://localhost:4000/api/v1` (replace with your actual server URL).

## 3. Automated Authentication (`apiClient.js`)
We have built a centralized Axios client (`src/api/apiClient.js`) fully configured for secure JWT communication.
* **Token Injection**: The client automatically intercepts every outgoing request and injects the active user's JWT token into the `Authorization: Bearer <token>` header.
* **Session Expiry**: If your backend returns a `401 Unauthorized` status, the frontend automatically intercepts it, clears the local storage, and kicks the user back to `/login`.

## 4. Data Shape Matching (The Contract)
The React components do not care whether the data is real or mock, but they **do care about property names**.
* The components expect JSON keys that match what was defined in `mockData.js` (e.g., `_id`, `createdAt`, `title`, `status`). 
* If your database uses different naming conventions (like `creation_date` instead of `createdAt`), you will either need to map them in your backend controllers before sending the JSON response, or globally find-and-replace the keys in the frontend components.

## 5. The Standard Response Wrapper
By default, the `apiClient.js` expects your backend to send data wrapped in a standard success envelope:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": { ... actual payload ... }
}
```
If your backend sends the raw payload directly without the `{ success, data }` wrapper, simply open `src/api/apiClient.js` and remove the unwrapping logic in the response interceptor (lines 26-32).

## 6. SPA Routing Configuration
We use `react-router-dom` for client-side navigation. 
* If you are hosting the frontend build files directly from your backend server (e.g., inside an Express.js `public/` directory or Spring Boot static folder), you must configure your server to fallback to serving `index.html` for all unrecognized routes. This prevents 404 errors when a user refreshes a page like `/student/portfolio`.
