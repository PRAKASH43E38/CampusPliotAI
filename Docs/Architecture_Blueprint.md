# 🏛️ CampusPilot AI - System Architecture Blueprint

This document defines the technical architecture for CampusPilot AI, ensuring institutional professionalism, scalability, and production-grade stability.

---

## 1. High-Level System Diagram (Logical Flow)
`User` $\rightarrow$ `Frontend (React)` $\rightarrow$ `API Gateway (Flask)` $\rightarrow$ `Auth (Firebase/JWT)` $\rightarrow$ `Business Logic (Services)` $\rightarrow$ `Data/AI Layer (MySQL/Gemini)`

---

## 2. Frontend Architecture (The UI/UX Layer)
**Tech:** React 18+, Vite, Tailwind CSS, Material Design 3.

### 2.1 Implementation Strategy (The Build Order)
To ensure professional quality, the frontend will be built in the following sequence:

1. **Design System Setup:** Implement Material 3 design tokens (Colors, Typography, Spacing) and Tailwind configuration.
2. **Global Shell Construction:** Build the `TopNavigation` and `AdaptiveSidebar` to establish the app's framework.
3. **Atomic Component Library:** Create reusable UI atoms (Buttons, Inputs, Cards) and molecules (Search Bars, Profile Chips).
4. **Page-by-Page Development (UI-First):**
   - **Landing Page:** Premium hero section and feature grid.
   - **Authentication Flow:** Professional login/register pages with validation.
   - **Core Dashboard:** Interactive widgets, academic countdowns, and announcements.
   - **Feature Modules:** Academics $\rightarrow$ AI Assistant $\rightarrow$ Faculty Directory $\rightarrow$ Resources $\rightarrow$ Campus Map $\rightarrow$ Events/Clubs.
5. **Mock Integration:** Use realistic JSON mock data to simulate a live system before backend merge.
6. **Responsive & Motion Polish:** Apply Framer Motion for smooth transitions and ensure perfect rendering across Mobile, Tablet, and Desktop.

### 2.2 Component Hierarchy (Atomic Design)
- **Atoms:** Basic inputs, buttons, badges, typography.
- **Molecules:** Search bar, profile chip, notification item.
- **Organisms:** Navigation Sidebar, AI Chat Window, Academic Table, Event Card.
- **Templates/Pages:** Dashboard, Resource Center, Admin Panel.

### 2.3 State & Routing
- **Global State:** Managed via `Context API` or `Zustand` for user authentication, theme settings, and global notifications.
- **Routing:** `React Router v6` with **Route Guards**.
    - `/public/*` $\rightarrow$ Landing, Login.
    - `/student/*` $\rightarrow$ Dashboard, Academics, AI Assistant.
    - `/faculty/*` $\rightarrow$ Department Mgmt, Student Tracking.
    - `/admin/*` $\rightarrow$ System Config, Analytics.

---

## 3. Backend Architecture (The Logic Layer)
**Tech:** Flask (Python), SQLAlchemy, Flask-JWT-Extended.

### 3.1 Layered Pattern
To avoid "Fat Controllers", we use a strict separation of concerns:
1. **Route Layer (Blueprints):** Defines endpoints and handles HTTP requests/responses.
2. **Controller Layer:** Validates input and orchestrates the service calls.
3. **Service Layer:** Contains core business logic (e.g., calculating attendance, processing AI prompts).
4. **Repository Layer:** Handles direct MySQL queries via SQLAlchemy ORM.

### 3.2 Security Implementation
- **Authentication:** Firebase Auth tokens sent via `Authorization: Bearer <token>` header.
- **Authorization:** RBAC (Role-Based Access Control) middleware to verify if the user has the required role for an endpoint.
- **Input Sanitization:** Pydantic/Marshmallow for request validation to prevent SQL Injection.

---

## 4. AI Architecture (The Knowledge Engine)
**Tech:** Google Gemini API $\rightarrow$ Groq (Fallback).

### 4.1 The AI Pipeline (RAG Approach)
To make the AI "Campus-Aware," we don't just send the user query. We use a **Context-Augmented Pipeline**:
1. **Query Analysis:** AI determines if the user is asking for a specific entity (e.g., "Where is Block A?").
2. **Knowledge Retrieval:** Backend fetches the precise data from MySQL (e.g., `SELECT location FROM buildings WHERE name='Block A'`).
3. **Prompt Construction:** 
   *System Prompt* + *Retrieved Campus Data* + *User Query* $\rightarrow$ `Gemini API`.
4. **Response Formatting:** AI returns a structured response (Markdown/JSON) which the frontend renders as professional cards.

---

## 5. Database Architecture (The Data Layer)
**Tech:** MySQL 8.0.

### 5.1 Domain Segregation
- **Identity Domain:** `users`, `roles`, `permissions`, `sessions`.
- **Academic Domain:** `departments`, `courses`, `subjects`, `timetables`, `attendance`, `marks`.
- **Campus Domain:** `buildings`, `cabins`, `classrooms`, `hostels`.
- **Engagement Domain:** `events`, `clubs`, `registrations`, `announcements`.
- **Resource Domain:** `categories`, `documents`, `downloads`, `bookmarks`.
- **AI Domain:** `chat_history`, `feedback`, `knowledge_base_logs`.

---

## 6. Infrastructure & Deployment
### 6.1 Deployment Pipeline
- **Frontend:** Hosted on **Vercel** (Edge Network) for ultra-fast global loading.
- **Backend:** Hosted on **Render** (Web Service) using Gunicorn as the WSGI server.
- **Database:** Managed **MySQL Cloud Instance** with automated daily backups.
- **Storage:** Files (PDFs, Images) stored in **AWS S3** or **Firebase Storage**, with URLs stored in MySQL.

### 6.2 Performance Strategy
- **Caching:** Redis (optional) for frequently accessed data like the Academic Calendar.
- **Lazy Loading:** Route-based code splitting in React to reduce initial bundle size.
- **Indexing:** Composite indexes on `(dept_id, subject_id)` for faster academic queries.
