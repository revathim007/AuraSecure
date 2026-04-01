# AuraSecure Project Technical Change Log
This document tracks all changes with deep technical insights for interview preparation.

---

### **Project Architecture Overview**
- **Strict Separation**: The project is structured into two root folders: `backend/` (Django REST API) and `frontend/` (React + Vite). This ensures a clean separation of concerns, where the backend handles data/logic and the frontend handles UI/UX.
- **Communication**: Communication between the two is handled via **Axios** (frontend) and **Django CORS Headers** (backend).

---

### **Detailed Technical Timeline**

#### **2026-04-01 12:00:00 | Project | Structural Foundation**
- **Action**: Created a strict `backend` and `frontend` directory structure.
- **Technical Note**: Avoiding nested projects or duplicate root files ensures clarity in the build pipeline and simplifies CI/CD configurations.

#### **2026-04-01 12:05:00 | Backend | Django Project Initialization**
- **Action**: Initialized Django using `python -m django startproject core .` in the `backend/` directory.
- **Technical Note**: Initializing with `.` (dot) prevents an extra nested folder, keeping `manage.py` at the root of the `backend/` folder for easier CLI access.

#### **2026-04-01 12:07:00 | Frontend | React (Vite) Scaffolding**
- **Action**: Scaffolded a React project using `vite` with the `react` template.
- **Technical Note**: **Vite** was chosen over `create-react-app` for its faster **HMR (Hot Module Replacement)** and use of native ES modules, which significantly improves development performance.

#### **2026-04-01 12:10:00 | Backend | API & CORS Configuration**
- **Action**: Configured `backend/core/settings.py` for API support.
- **Technical Detail - `INSTALLED_APPS`**: Added `rest_framework` (for API tools) and `corsheaders` (to handle cross-origin requests).
- **Technical Detail - `MIDDLEWARE`**: Placed `corsheaders.middleware.CorsMiddleware` at the **top** of the middleware list. This is critical as it must intercept requests before they reach other middleware that might return a response (like security or session middleware).
- **Technical Detail - `CORS_ALLOW_ALL_ORIGINS`**: Set to `True` for development. This allows the React app (running on port 5173) to securely communicate with the Django app (running on port 8000).
- **Technical Detail - `views.py`**:
  - Used `@api_view(['GET'])` decorator from DRF. This restricts the endpoint to GET requests and automatically handles JSON serialization of the response.
  - Returns a `Response` object, which provides a standard format for API data.
- **Technical Detail - `urls.py`**: Mapped `api/welcome/` to the `welcome_api` view, following RESTful naming conventions.

#### **2026-04-01 12:15:00 | Frontend | React Implementation & API Integration**
- **Action**: Developed the `App.jsx` component and integrated with the backend.
- **Technical Detail - State Management**: Used `useState` to manage the `message` state, which is dynamically updated after the API call.
- **Technical Detail - Lifecycle Hooks**: Used `useEffect` with an empty dependency array `[]` to trigger the API call exactly once when the component mounts.
- **Technical Detail - API Client**: Used **Axios** for HTTP requests. Axios is preferred over the native `fetch` API because it automatically handles JSON parsing and has better error handling (e.g., throwing on 4xx/5xx errors).
- **Technical Detail - JSX Structure**: Implemented a clean, semantic structure with a container and a heading for the "Welcome" message.

#### **2026-04-01 12:17:00 | Frontend | UI/UX & Styling**
- **Action**: Styled the application in `App.css`.
- **Technical Detail - Layout**: Used **Flexbox** (`display: flex`) with `justify-content: center` and `align-items: center` to perfectly center the content both horizontally and vertically.
- **Technical Detail - Units**: Used `height: 100vh` to ensure the container takes up the full viewport height.
- **Technical Detail - Color Palette**: Applied a specific brown color scheme (`#8B4513`) for a professional and warm look, as requested.

#### **2026-04-01 12:20:00 | Project | Final Optimization & Cleanup**
- **Action**: Removed all boilerplate assets (Vite logos, default React icons, etc.).
- **Technical Note**: Deleting unused files (`src/assets`, `public/icons.svg`) reduces the bundle size and ensures the repository only contains relevant code, which is a sign of high-quality software engineering.
- **Verification**: Verified the end-to-end flow by running both servers simultaneously and confirming successful data retrieval from the backend.

#### **2026-04-01 12:25:00 | Frontend | UI Branding & Interaction**
- **Action**: Updated [App.jsx](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/frontend/src/App.jsx) to include branding and a "Get Started" call-to-action.
- **Technical Detail - UI Components**: Replaced "Welcome" with the product name "AURASECURE" in the primary heading.
- **Technical Detail - Button Implementation**: Added a semantic `<button>` element with a class `get-started-btn`.
- **Technical Detail - CSS Styling**:
  - **Interaction States**: Implemented `:hover` and `:active` pseudo-classes in [App.css](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/frontend/src/App.css) for visual feedback.
  - **Visual Polish**: Added `box-shadow` for depth and `transition: transform` for smooth micro-animations, enhancing the overall UX.
  - **Button Design**: Used `border-radius: 30px` for a modern pill-shaped design, maintaining consistency with the brown color palette.

#### **2026-04-01 12:35:00 | Frontend | Registration System & Routing**
- **Action**: Implemented multi-page navigation and a secure registration form.
- **Technical Detail - Routing**: Integrated `react-router-dom` in [main.jsx](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/frontend/src/main.jsx) to handle client-side navigation between `/` (Welcome) and `/registration`.
- **Technical Detail - Registration Component**: Created [Registration.jsx](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/frontend/src/Registration.jsx) with a controlled form for:
  - Full Name, Username, Email, Contact Number, and Password.
- **Technical Detail - Password Security**: 
  - Implemented a visibility toggle using `useState` and icons from `lucide-react`.
  - Used `type={showPassword ? "text" : "password"}` for conditional rendering.
- **Technical Detail - Form UX**:
  - Added real-time state updates using a generic `handleChange` function for efficient code reuse.
  - Implemented a `Registration Card` UI with box-shadows and semantic styling for better accessibility.
  - Added a "Back to Home" navigation feature using the `useNavigate` hook.

#### **2026-04-01 12:45:00 | Frontend | Form Validation & Login Integration**
- **Action**: Implemented comprehensive client-side validation and a new Login page.
- **Technical Detail - Validation Logic**:
  - **Regex Patterns**: Used specialized regular expressions for Full Name (alpha-only), Email (standard pattern), Username (alphanumeric), and Contact Number (10 digits).
  - **Password Strength**: Enforced a strict policy (min 8 chars, uppercase, lowercase, number, and special character) using positive lookahead assertions `(?=...)`.
  - **Dynamic Error Feedback**: Integrated an `errors` state object to map validation failures to specific UI elements in real-time.
- **Technical Detail - Navigation Flow**:
  - Updated the `handleSubmit` logic in [Registration.jsx](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/frontend/src/Registration.jsx) to navigate to `/login` only upon successful validation.
- **Technical Detail - Component Creation**:
  - Created [Login.jsx](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/frontend/src/Login.jsx) as a streamlined authentication entry point.
- **Technical Detail - Routing Update**:
  - Registered the `/login` route in [main.jsx](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/frontend/src/main.jsx) to complete the authentication user journey.

#### **2026-04-01 13:00:00 | Frontend | Authentication Persistence & Dashboard**
- **Action**: Implemented user persistence, login validation, and a secure dashboard view.
- **Technical Detail - Data Persistence**:
  - Used `localStorage` to simulate a database. Registered users are stored in a `users` array, allowing cross-page validation without a live backend connection.
- **Technical Detail - Login Logic**:
  - **User Lookup**: Implemented an `.find()` operation on the stored users array to identify matching usernames.
  - **Refined Error Handling**: Updated validation to prompt "Please register" when a username is not found in `localStorage`, improving the user journey for unregistered visitors.
  - **Credential Verification**: Developed specific error handling to distinguish between unregistered users and "Wrong password", providing precise feedback to the user.
- **Technical Detail - Session Management**:
  - On successful login, the application stores the user object in `localStorage` under `currentUser`. This simulates a session token for personalizing the dashboard.
- **Technical Detail - Dashboard Component**:
  - Created [Dashboard.jsx](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/frontend/src/Dashboard.jsx) which dynamically displays user-specific information (Full Name, Email, Contact) retrieved from the active session.
- **Technical Detail - **Security (Logout)**: Implemented a `handleLogout` function that clears the `currentUser` from storage and redirects to the login page, ensuring session termination.
- **Technical Detail - UI/UX Navigation Enhancement**:
  - Added a "Already have an account? Login" clickable label in [Registration.jsx](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/frontend/src/Registration.jsx) to improve the bidirectional navigation flow between authentication pages.
- **Technical Detail - Routing Expansion**:
  - Added the `/dashboard` route to the application's main route configuration.
