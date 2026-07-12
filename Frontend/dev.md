# Frontend Development Guidelines & Workflow

This document outlines the standard operating procedure for creating new pages, connecting to APIs, and collaborating effectively in the `IMS-Frontend` repository. Since the project uses **Vite, React, React Router, Axios, and React Query**, these guidelines are tailored to maximize the benefits of that stack.

## 1. Process for Creating a New Page & Connecting an API

When you are assigned a new feature or page that connects to a backend API, follow these exact steps to maintain consistency:

### Step 1: Define API Endpoints
- **Create an Axios service:** Under `src/api/`, create a new file for your feature domain (e.g., `src/api/productsApi.js`).
- **Define raw fetching functions:** Use the pre-configured Axios instance to define your `GET`, `POST`, `PUT`, `DELETE` requests. Keep these functions simple; they should only handle the network request and return the data.

### Step 2: Create Custom React Query Hooks
- **Create a Hook file:** Under `src/hooks/`, create a file for your query hooks (e.g., `src/hooks/useProducts.js`).
- **Wrap Axios calls:** Import your Axios functions and wrap them using `@tanstack/react-query`'s `useQuery` (for fetching) or `useMutation` (for creating/updating/deleting). This is the crucial layer that handles caching, retries, and background updates.

### Step 3: Build the UI Components
- **Modular Components:** Under `src/components/`, create a dedicated folder for your domain and build smaller, reusable components (e.g., `src/components/products/ProductCard.jsx`).
- **Keep them "Dumb":** These components should ideally receive data via props rather than fetching it themselves.

### Step 4: Create the Page
- **Page Assembly:** Under `src/pages/`, create the new page component (e.g., `src/pages/products/ProductsList.jsx`).
- **Fetch Data Here:** Use your custom hooks (e.g., `const { data, isLoading, isError } = useProducts()`) at the top level of your page. Pass the resulting data down to your "dumb" components.

### Step 5: Add Routing
- **Update App.jsx (or your router config):** Add your new page to the `react-router-dom` configuration in `src/App.jsx`.

---

## 2. Rules for Minimizing Backend Strain

Since the project is set up with `@tanstack/react-query`, you have the perfect tool to reduce unnecessary backend requests. Adhere to the following rules:

> [!CAUTION]
> **Never use `useEffect` + `axios` directly in your components for fetching data.** ALWAYS use custom `useQuery` hooks. React Query automatically dedupes multiple identical requests and serves cached data instantly.

- **Configure Stale Time Appropriately:** By default, React Query considers fetched data "stale" immediately, meaning it will refetch in the background on window focus. If your data doesn't change every second, set a sensible `staleTime` (e.g., `staleTime: 5 * 60 * 1000` for 5 minutes) in your query hook to prevent unnecessary network requests when the user switches tabs or navigates away and back.
- **Use Pagination and Filtering on the Backend:** Do not fetch all records and filter/paginate on the frontend. Pass query parameters to your API (e.g., `?page=1&limit=20`) to only request what the user currently sees.
- **Implement Debouncing for Search:** If you have an autocomplete or search input, use a custom hook to debounce the user's input before triggering the API request. **Do not send an API request on every keystroke.**
- **Optimistic Updates:** For mutations (like favoriting an item or updating a status), update the React Query cache immediately before the backend responds. This makes the app feel snappy and often negates the need for an immediate refetch of the list.
- **Avoid Polling Unless Absolutely Necessary:** If you need real-time data, consider WebSockets. If you must use HTTP polling with `refetchInterval` in React Query, set the interval to the highest acceptable value (e.g., 30 seconds rather than 1 second).

---

## 3. Team Collaboration Instructions

To ensure multiple developers can work simultaneously without creating merge conflicts or blocking each other:

- **Feature-Based Branching:** Developers must create isolated branches for their features (e.g., `feature/products-page` or `feat/auth-login`).
- **Domain Separation (The Golden Rule):** Developers should work exclusively within their assigned feature domains. If Developer A is working on *Orders*, they will only touch files in `src/api/ordersApi.js`, `src/hooks/useOrders.js`, and `src/pages/orders/`. If Developer B is working on *Users*, they work in entirely different files. **This guarantees nearly zero merge conflicts.**
- **Shared Components & Utilities:** If a developer needs a reusable component (like a custom Button, Modal, or a formatted date utility), they should check if it exists in `src/components/common/` or `src/utils/` first. If they create a new shared resource, they must announce it to the team to avoid duplication.
- **Mock Data While Waiting for Backend:** If the frontend developer is ready but the backend API is still under construction, they should **mock the API response locally in the Axios service layer**. Once the backend is ready, they only need to change the Axios call, and the rest of the application (hooks, pages, components) will work seamlessly.
- **No Direct Commits to Main:** All code must go through Pull Requests (PRs). This ensures code reviews happen and team members stay informed about newly added shared components.
