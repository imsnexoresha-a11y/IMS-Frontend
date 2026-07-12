# Intern Management System (IMS) Frontend

This is the frontend scaffolding for the IMS application. It provides a complete design system, component library, routing skeleton, and mock API layer tailored for a 4-role (Admin, Teacher, Student, Recruiter) MERN stack architecture.

## Tech Stack
- **Framework:** React 18 (Vite), JavaScript
- **Routing:** React Router v6
- **State Management / Data Fetching:** Context API (Auth/UI state), TanStack Query (Server state - setup ready)
- **Styling:** CSS Modules with a custom Neobrutalist Design System (No Tailwind/MUI)
- **Icons & Charts:** Lucide-React, Recharts
- **Forms:** React Hook Form

## Features
1. **Neobrutalist Design System**: Found in `src/styles/theme.css`. Thick 3px borders, hard offset shadows, high contrast, sharp corners, and interactive press animations.
2. **Component Library**: 30+ reusable UI components (`src/components/common`) built to strict neobrutalist specs (DataTable, Button, Modal, Card, etc.).
3. **Mock API Layer**: `src/api` contains full Axios-ready modules that currently return mock data for every feature.
4. **Role-Based Routing**: Defined in `App.jsx` and guarded by `RoleRoute.jsx` (`/admin`, `/teacher`, `/student`, `/recruiter`).
5. **Dev Role Switcher**: Available in the topbar to quickly toggle between roles without re-logging in.

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

### Authentication (Mock)
Login accepts any email. The mock `AuthContext` will look at the domain/email to determine the role:
- `admin@ims.dev` -> Admin
- `teacher@ims.dev` -> Teacher
- `student@ims.dev` -> Student

Use the Dev Role Switcher in the Topbar to change views.

## Project Structure
- `/src/styles`: CSS variables, resets, and globals.
- `/src/components/common`: The neobrutalist component library.
- `/src/components/layout`: AppShell, Sidebar, Topbar, etc.
- `/src/components/[role]`: Feature components specific to a role.
- `/src/pages`: Top-level route components.
- `/src/api`: Axios client and mock implementations.
- `/src/context`: Auth and UI contexts.
- `/src/hooks`: Custom hooks (Auth, API integration).
- `/src/utils`: Constants and formatting helpers.

## Next Steps for Full Implementation
To connect to the real backend:
1. Update `src/api/apiClient.js` with the real `baseURL` (e.g. from `.env`).
2. Replace the simulated `delay()` calls in `src/api/*Api.js` files with actual `apiClient.get/post/etc` calls.
3. Update `TanStack Query` hooks in `src/hooks/` to use real backend payload structures.
