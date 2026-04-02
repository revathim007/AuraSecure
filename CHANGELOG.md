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
- **Technical Detail - Security (Logout)**: Implemented a `handleLogout` function that clears the `currentUser` from storage and redirects to the login page, ensuring session termination.
- **Technical Detail - UI/UX Navigation Enhancement**:
  - Added a "Already have an account? Login" clickable label in [Registration.jsx](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/frontend/src/Registration.jsx) to improve the bidirectional navigation flow between authentication pages.
- **Technical Detail - Routing Expansion**:
  - Added the `/dashboard` route to the application's main route configuration.

#### **2026-04-01 13:15:00 | Backend | Database Migration to Azure SQL**
- **Action**: Upgraded the backend database from SQLite to a production-ready Azure SQL Database.
- **Technical Detail - Dependency Management**:
  - Installed `mssql-django`, `pyodbc`, and `python-dotenv`.
  - Updated `requirements.txt` to ensure these packages are included in future deployments.
- **Technical Detail - Secure Configuration**:
  - Created a `.env` file in the `backend/` directory to store sensitive database credentials (DB_NAME, DB_USER, etc.), keeping them out of version control.
- **Technical Detail - Settings Refactor**:
  - Integrated `python-dotenv` in `settings.py` to load environment variables at runtime using `load_dotenv()`.
  - Replaced the default SQLite `DATABASES` configuration with a new `mssql` engine setup.
  - Configured the connection with `ODBC Driver 18 for SQL Server`, `Encrypt=yes`, and a `Timeout` of 30 seconds, following Azure best practices.
- **Architectural Impact**: This migration transitions the project from a development-centric file-based database to a scalable, secure, and cloud-ready relational database, making it suitable for deployment on an Azure VM.

#### **2026-04-01 13:30:00 | Backend | Model Integration & Registration API**
- **Action**: Integrated existing Azure SQL tables into Django and implemented a secure user registration API.
- **Technical Detail - Model Generation**:
  - Created `api/models.py` using the output of `inspectdb` to map to the existing database schema.
  - Set `managed = False` in the model `Meta` classes to prevent Django from altering the existing tables.
- **Technical Detail - Serialization & Security**:
  - Implemented `api/serializers.py` with a `UserSerializer` for the `Users` model.
  - Overrode the `create` method in the serializer to automatically hash passwords using `make_password` before saving them to the database.
- **Technical Detail - API Endpoint**:
  - Created a `register_user` view in `api/views.py` that uses the `UserSerializer` to validate and create new users.
  - Established a new API endpoint at `api/register/` by creating `api/urls.py` and including it in the project's root URL configuration.
- **Architectural Impact**: This step fully integrates the Django backend with the existing data, enabling secure, ORM-driven interactions and providing a robust foundation for future feature development.

#### **2026-04-01 13:45:00 | Full-Stack | Registration Integration**
- **Action**: Connected the frontend registration form to the backend API, completing the full-stack user registration flow.
- **Technical Detail - API Call**:
  - Implemented an `async/await` function in `Registration.jsx` to handle the form submission.
  - Used `axios.post` to send the form data to the `http://localhost:8000/api/register/` endpoint.
- **Technical Detail - Data Mapping**:
  - Mapped the frontend's camelCase `formData` (e.g., `fullName`) to the backend's snake_case `UserSerializer` fields (e.g., `full_name`) in the request payload.
- **Technical Detail - Error Handling**:
  - Wrapped the API call in a `try...catch` block to gracefully handle network errors or backend validation failures.
  - Implemented logic to parse validation errors from the backend response and display them in the frontend UI, ensuring a seamless user experience.
- **Architectural Impact**: This completes the end-to-end registration feature, where a user can securely sign up through the frontend, have their data validated by both client and server, and have it persisted in the Azure SQL database with a hashed password.

#### **2026-04-01 14:00:00 | Full-Stack | Login Authentication**
- **Action**: Implemented a full-stack login system that authenticates against the Azure SQL database.
- **Technical Detail - Backend API**:
  - Created a new `api/login/` endpoint in `api/views.py` to handle user authentication.
  - Implemented a `try...except` block to gracefully handle `Users.DoesNotExist` errors, returning a `404 Not Found` with a "No user found" message.
  - Used Django's `check_password` function to securely compare the provided password with the hashed password in the database.
- **Technical Detail - Frontend Integration**:
  - Updated `Login.jsx` to send a `POST` request to the new `api/login/` endpoint.
  - Replaced the `localStorage` simulation with a real API call, completing the full-stack authentication flow.
  - Implemented error handling to display specific messages from the backend, such as "No user found" or "Wrong password".
- **Architectural Impact**: This feature establishes a secure and complete authentication cycle. Users can now register, have their data stored in a production database, and log in with their credentials, with the backend managing the entire authentication process.

#### **2026-04-01 14:15:00 | Backend | Enhanced Registration Validation**
- **Action**: Refined the registration API to provide explicit feedback for non-unique fields.
- **Technical Detail - Unique Field Validation**:
  - Leveraged Django REST Framework's built-in validators, which automatically check the `unique=True` constraint on the `username` and `email` fields in the `Users` model.
  - When a user attempts to register with an existing username or email, the API now returns a `400 Bad Request` with a specific error message (e.g., "A user with that username already exists.").
- **Technical Detail - Security Note**:
  - Intentionally avoided implementing a "password is taken" check, as this is a significant security vulnerability that could lead to password enumeration attacks. The system's security relies on password strength and hashing, not uniqueness.
- **Architectural Impact**: This enhancement makes the registration process more robust and user-friendly by providing clear, actionable error messages while adhering to security best practices.

#### **2026-04-01 14:30:00 | Frontend | Theming and UI Refinement**
- **Action**: Implemented a new color theme and refined the UI.
- **Technical Detail - CSS Variables**: Defined a new color palette in `index.css` using CSS variables for easy theme management.
- **Technical Detail - Dark Mode**: Implemented a dark mode using the `prefers-color-scheme` media query.
- **Technical Detail - Component Styling**: Updated `App.css` to use the new CSS variables, ensuring a consistent look and feel across the application.

#### **2026-04-01 14:45:00 | Frontend | Navigation and Dashboard Enhancements**
- **Action**: Added a persistent navigation bar and a new "Hazard Detection" page.
- **Technical Detail - Header Component**: Created a `Header.jsx` component to house the navigation bar, ensuring it appears on every page except the homepage.
- **Technical Detail - Routing**: Added a new route for the `/hazard-detection` page in `main.jsx`.
- **Technical Detail - Conditional Rendering**: Used the `useLocation` hook from `react-router-dom` to conditionally render the `Header` component based on the current URL.

#### **2026-04-01 15:00:00 | Full-Stack | Sensor Data Submission**
- **Action**: Implemented the functionality to save sensor data from the "Hazard Detection" page to the database.
- **Technical Detail - Backend API**: Created a new `api/user-input-sensor-data/` endpoint to handle the creation of new sensor data entries.
- **Technical Detail - Serializer**: Created a `UserInputSensorDataSerializer` to validate and serialize the incoming sensor data.
- **Technical Detail - Frontend Integration**: Modified `HazardDetection.jsx` to send the sensor data to the new API endpoint when the "Detect Hazard" button is clicked.
- **Technical Detail - Validation**: Implemented comprehensive client-side validation in `HazardDetection.jsx` to ensure the data is in the correct format before being sent to the backend.

#### **2026-04-01 16:15:00 | Machine Learning | Gradient Boosting Hazard Detection**
- **Action**: Upgraded the hazard detection system from a simple threshold-based check to a multi-tiered predictive model.
- **Technical Detail - Dependency Management**: Added `scikit-learn` and `joblib` to `requirements.txt` to support advanced ML algorithms and model serialization.
- **Technical Detail - Advanced Modeling**: 
  - Implemented a `GradientBoostingClassifier` in [train_model.py](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/backend/ml/train_model.py) to identify complex "at-risk" patterns in sensor data.
  - Defined a three-tier classification system: **Safe (0)**, **Warning (1)**, and **Alarm (2)**.
- **Technical Detail - Data Engineering**:
  - Engineered the target variable using `numpy.select` based on specific risk thresholds:
    - **Alarm**: Gas > 250, Smoke > 15, or Temp > 90.
    - **Warning**: Gas > 200, Smoke > 10, or Temp > 75 (excluding Alarms).
    - **Safe**: All other readings.
- **Architectural Impact**: This shift from hardcoded rules to a trained model allows for proactive risk mitigation by flagging "Warning" states before they escalate into critical alarms.

#### **2026-04-01 16:30:00 | Backend | Descriptive & Actionable API Responses**
- **Action**: Enhanced the `predict_hazard` API to provide meaningful context and emergency instructions.
- **Technical Detail - Reason Extraction**: Developed a `get_prediction_reason` function in [views.py](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/backend/api/views.py) that dynamically identifies which specific sensors (Gas, Smoke, or Temp) triggered the current status.
- **Technical Detail - Actionable Statements**: Added a `statement` field to the API response, providing users with immediate instructions (e.g., "EVACUATE IMMEDIATELY!" for Alarms or "Monitor levels closely" for Warnings).
- **Technical Detail - Multi-Value Logic**: Implemented `{' and '.join(reasons)}` to handle scenarios where multiple sensors are simultaneously elevated, ensuring clear and accurate reporting.
- **Technical Detail - Data Persistence**: Integrated automatic saving of sensor readings and their corresponding predictions into the `UserInputSensorData` table during the prediction request cycle. This ensures a historical record of all hazard detection attempts.

#### **2026-04-01 16:45:00 | Frontend | Proactive Safety UI/UX**
- **Action**: Overhauled the "Hazard Detection" interface to emphasize status visibility and emergency instructions.
- **Technical Detail - Visual Hierarchy**:
  - Integrated **Lucide Icons** (`AlertCircle`, `AlertTriangle`, `ShieldCheck`) in [HazardDetection.jsx](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/frontend/src/HazardDetection.jsx) for instant cognitive recognition of safety status.
  - Implemented a severity-based color system: Green (Safe), Yellow (Warning), and Red (Alarm).
- **Technical Detail - UI Polish**:
  - Added a **pulsing CSS animation** for the "Alarm" statement to capture the user's attention during critical hazards.
  - Implemented conditional CSS classes in [App.css](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/frontend/src/App.css) to apply distinct borders and backgrounds for each status summary.
- **Technical Detail - Validation Update**: Relaxed the temperature validation threshold to 100°C to accommodate high-risk monitoring scenarios.
- **Architectural Impact**: The UI now acts as a proactive safety dashboard rather than just a data entry form, providing users with both the "What" (Status) and the "Why" (Reason) alongside clear instructions on the "How" (Action).

#### **2026-04-01 17:00:00 | Frontend | Emergency Alert Dispatch System**
- **Action**: Implemented a dedicated alerting system to allow users to escalate hazard detections.
- **Technical Detail - New Component**: Created [SendAlerts.jsx](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/frontend/src/SendAlerts.jsx) as a centralized hub for dispatching emergency notifications.
- **Technical Detail - Routing**: Registered the `/send-alerts` route in [main.jsx](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/frontend/src/main.jsx) for unified navigation.
- **Technical Detail - Data Transfer**: Utilized `navigate` with `state` in [HazardDetection.jsx](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/frontend/src/HazardDetection.jsx) to pass hazard context (prediction & reason) to the alert center without redundant API calls.
- **Technical Detail - UI/UX Polish**:
  - Implemented a "Send Alerts" button in the Hazard Detection summary, conditionally visible only during **Alarm** or **Warning** states.
  - Added a simulated dispatch workflow with visual feedback (CheckCircle icon, status changes) to provide user reassurance during emergencies.
  - Applied specialized styling in [App.css](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/frontend/src/App.css) for the Alert Center, using a high-contrast emergency theme.
- **Architectural Impact**: This feature closes the loop between hazard identification and incident response, transforming the app into an end-to-end safety management platform.

#### **2026-04-01 17:15:00 | Database | Transition to Local SSMS**
- **Action**: Migrated the database connection from Azure SQL Database to local SQL Server (SSMS) due to billing/resource reasons.
- **Technical Detail - Environment Update**: 
  - Updated [.env](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/backend/.env) to use `localhost` as the database host and added flexibility for local connection settings (`DB_TRUST_CERT`, `DB_ENCRYPT`).
  - Modified [settings.py](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/backend/core/settings.py) to dynamically read encryption and certificate trust settings from environment variables.
- **Architectural Impact**: Ensures project continuity while managing infrastructure costs. The system is now ready for local development and testing on the user's workstation.

#### **2026-04-02 10:30:00 | Backend | Model Integration & Automated Alerting**
- **Action**: Implemented comprehensive prediction logic and automated database persistence for hazard detection.
- **Technical Detail - Model Loading**: 
  - Integrated `joblib` to load the pre-trained `GradientBoostingClassifier` model (`gradient_boosting_model.joblib`) within the Django runtime.
- **Technical Detail - Prediction Logic**:
  - Updated the `predict_hazard` view in [views.py](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/backend/api/views.py) to process real-time sensor data (Gas, Smoke, Temperature) through the ML model.
  - Implemented a 3-tier result mapping: `0: Safe`, `1: Warning`, `2: Alarm`.
- **Technical Detail - Multi-Table Data Persistence**:
  - **UserInputSensorData**: Automatically stores raw sensor readings, user context, and timestamps.
  - **Predictions**: Stores the model's output and confidence score linked to the sensor entry.
  - **Alerts**: Automatically creates an alert record with a descriptive message whenever a `Warning` or `Alarm` status is predicted.
- **Architectural Impact**: This update transforms the API from a simple prediction service into a robust monitoring system that maintains a complete audit trail of sensor history, model decisions, and triggered alerts.

#### **2026-04-02 10:20:00 | Frontend | UI Label Update**
- **Action**: Renamed the "Historical Data" navigation button to "Forecasting".
- **Technical Detail**: Updated the [Header.jsx](file:///d:/Revathi/Biz%20Metric%20Internship/AuraSecureProject/frontend/src/Header.jsx) component to reflect the new label, aligning the UI with the project's predictive modeling focus.
- **Architectural Impact**: This minor label change clarifies the intended functionality of the dashboard, moving from retrospective reporting to proactive forecasting.
