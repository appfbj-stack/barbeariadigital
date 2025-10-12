# AI Development Rules for BarberTime+

This document outlines the technical stack and development conventions for the BarberTime+ application. Adhering to these rules ensures consistency, maintainability, and quality in the codebase.

## 🚀 Tech Stack

The application is built with a modern, lightweight, and efficient stack:

- **Framework**: React with TypeScript for a robust and type-safe user interface.
- **Build Tool**: Vite provides a fast development server and optimized production builds.
- **Styling**: Tailwind CSS is used exclusively for styling via its utility-first classes.
- **Backend**: Supabase serves as the backend, providing the database and data access APIs.
- **State Management**: State is managed locally within components using React Hooks (`useState`, `useEffect`).
- **Icons**: All icons are custom SVG components located in `components/icons.tsx`.
- **Progressive Web App (PWA)**: The app is configured with `vite-plugin-pwa` to be installable and work offline.
- **AI Integration**: Google Gemini AI is planned for integration for specific features.

## 🛠️ Development & Library Rules

Follow these guidelines strictly when adding or modifying code.

### 1. UI Components
- **Build, Don't Add**: Do not add a third-party component library (like Shadcn/UI, Material-UI, etc.).
- **Custom Components**: Create new, reusable components in the `components/` directory.
- **Composition**: Favor component composition to build complex UIs from simple, single-responsibility components.

### 2. Styling
- **Tailwind CSS Only**: All styling must be done using Tailwind CSS utility classes.
- **No Custom CSS**: Avoid writing custom CSS in `.css` files. The existing `public/index.css` is for base styles and fonts only.
- **Consistency**: Follow the existing design patterns (colors, spacing, fonts) established in the current components.

### 3. Icons
- **Use Existing Icons**: All icons must be imported from `components/icons.tsx`.
- **Adding New Icons**: If a new icon is required, add it as a new SVG React component to `components/icons.tsx`. Do not install icon libraries like `lucide-react` or `Font Awesome`.

### 4. Data Fetching & Backend
- **Service Layer**: All communication with Supabase MUST go through the service functions defined in `services/supabaseService.ts`.
- **No Direct API Calls**: Components should not call `supabase` directly. This abstracts the data logic and makes components purely presentational.
- **Type Safety**: Ensure all data fetched from the backend is correctly typed using the interfaces defined in `types.ts`.

### 5. State Management
- **React Hooks**: Use `useState` and `useEffect` for local component state.
- **No Global State Libraries**: Do not add global state management libraries like Redux, Zustand, or MobX. If global state is needed, use React's Context API for simple cases.

### 6. Routing
- **State-Based Views**: The application uses a state variable (`currentView`) in `App.tsx` to switch between the 'booking' and 'admin' panels.
- **No Router Library**: Do not add `react-router-dom` or any other routing library. Continue using the existing state-based approach for view management.

### 7. Code Quality
- **TypeScript**: Write clean, readable, and strongly-typed TypeScript code.
- **Simplicity**: Keep components small and focused on a single responsibility. Avoid over-engineering solutions.