

Objective:
Upgrade the existing **Medirator Frontend 2.0 (React + Vite + Tailwind CSS v4)** by strictly enforcing the defined **typography system** across the entire application and implementing a **secure Google-based authentication system** with proper role handling and session management.

---

## 1. Typography System Enforcement (CRITICAL)

Use the existing typography definitions in `src/index.css` as the **single source of truth** and ensure strict adherence across all components.

### Font Usage Rules

* **Eczar (`font-eczar`)**

  * Use ONLY for:

    * Brand name “Medirator”
    * Logo/wordmark in navbar
  * Must remain consistent across:

    * Public layout
    * Doctor layout
    * Admin layout

---

* **IBM Plex Mono (`font-ibm-plex-mono`)**

  * Use for ALL readable UI text:

    * Navigation menus
    * Buttons
    * Forms (labels, inputs, placeholders)
    * Cards and tables
    * Chat interface
    * Data Explorer
    * Helper text and descriptions
  * This is the **default UI font across the app**

---

* **Jersey 10 (`font-jersey`)**

  * Use ONLY for:

    * Large hero headlines
    * High-impact statements
    * Footer hero section
  * DO NOT use for:

    * Paragraphs
    * Buttons
    * Forms
    * Any standard UI text

---

* **Agbalumo & Grand Hotel**

  * Keep unused in UI
  * Reserved for future design expansions
  * Do NOT apply unless explicitly required

---

### Implementation Requirements

* Audit all components and replace inconsistent font usage
* Ensure Tailwind utility classes are applied correctly
* Maintain consistent typography across:

  * Public pages
  * Assistant UI
  * Data Explorer
  * Admin/Doctor dashboards

---

## 2. Google Authentication System (MANDATORY)

Implement a **secure Google Sign-In system** with proper authentication flow and backend validation.

### Frontend Requirements

* Add “Continue with Google” button on:

  * Login page
  * Register page

* Use:

  * `@react-oauth/google` OR Google Identity Services

* On successful login:

  * Retrieve Google user profile (name, email, profile picture)
  * Send token to backend for verification

---

### Backend (FastAPI) Requirements

* Create endpoint:

  * `/auth/google`

* Validate Google ID token using:

  * Google OAuth2 token verification

* On successful verification:

  * Create or fetch user in database
  * Assign role (default: user / doctor / admin based on logic)

* Return:

  * JWT access token
  * User metadata

---

### Authentication Flow

1. User clicks “Continue with Google”
2. Google OAuth popup opens
3. User selects account
4. Frontend receives Google credential
5. Send credential to FastAPI backend
6. Backend verifies token
7. Backend returns JWT
8. Store JWT securely (HTTP-only cookie or secure storage)
9. Redirect user based on role:

   * Public user → main app
   * Doctor → doctor dashboard
   * Admin → admin panel

---

### Security Requirements

* Use HTTPS (for production readiness)
* Do NOT trust frontend-only authentication
* Always verify tokens in backend
* Implement:

  * Token expiration
  * Secure session handling
  * Protected routes using JWT

---

## 3. Integration with Existing System

* Ensure compatibility with:

  * `ProtectedRoute`
  * `LanguageProvider`
  * Dark mode state
  * Lazy-loaded routes

* Maintain current routing structure:

  * `/login`
  * `/register`
  * `/about`
  * `/privacy-policy`
  * etc.

---

## 4. UI/UX Enhancements for Auth

* Use Tailwind for clean UI
* Google button styling:

  * White background
  * Google icon
  * Subtle shadow
* Show:

  * Loading state during authentication
  * Error messages on failure

---

## 5. Final Outcome

Deliver a frontend that:

* Strictly follows the **Medirator typography system**
* Uses consistent, professional UI styling
* Implements **secure Google authentication**
* Properly integrates with FastAPI backend
* Supports role-based access and protected routes
* Feels like a production-ready healthcare platform

---
