Technical Requirements Document (TRD)
Placement Prediction Web Application
Version: 1.0Architecture Style: Modern Full-Stack SaaSFrontend: React + TypeScript + Vite/Next.jsBackend: Supabase + Edge Functions + FastAPI ML ServiceAI Development Target: Antigravity AI AgentUI Components: 21st.dev + shadcn/ui
1. SYSTEM ARCHITECTURE
High-Level Architecture
┌─────────────────────────────┐
│         Frontend            │
│ React + JavaScript          │
│ 21st.dev + shadcn/ui        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         Supabase API        │
│ Auth + Database + Storage   │
└───────┬───────────┬─────────┘
        │           │
        ▼           ▼
┌────────────┐ ┌──────────────┐
│ PostgreSQL │ │ File Storage │
└────────────┘ └──────────────┘
        │
        ▼
┌─────────────────────────────┐
│     ML Prediction Service   │
│ FastAPI + Scikit Learn      │
│ Logistic Regression         │
└──────────────┬──────────────┘
               ▼
      Prediction Response
Frontend Architecture
Presentation Layer
       ↓
Pages
       ↓
Feature Modules
       ↓
API Services
       ↓
Supabase Client
Layers:
UI Components
Pages
Hooks
State Management
Services
Utilities
Types
Backend Architecture
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
Supabase/Postgres
ML Service:
API
 ↓
Validation
 ↓
Encoder
 ↓
Logistic Regression
 ↓
Prediction
Database Architecture
Database: PostgreSQL (Supabase)
Approach:
Users
Student Profiles
Predictions
Companies
Eligibility Rules
Reports
Notifications
Authentication Architecture
User Login
      ↓
Supabase Auth
      ↓
JWT Token
      ↓
Role Validation
      ↓
Protected Routes
Roles:
student
placement_officer
admin
Deployment Architecture
Frontend
(Vercel)
      ↓
Supabase
(Auth + DB + Storage)
      ↓
ML Service
(Railway / Render)
      ↓
Monitoring
(Posthog + Sentry)
2. TECHNOLOGY STACK
Frontend
React 19 
TypeScript 
Vite (or Next.js) 
React Router 
UI
21st.dev Components 
shadcn/ui 
Tailwind CSS 
State Management
Zustand 
React Query (TanStack Query) 
Backend
Supabase 
FastAPI 
Database
PostgreSQL 
Authentication
Supabase Auth 
File Storage
Supabase Storage 
Analytics
Posthog 
Error Tracking
Sentry 
Charts
Recharts 
3. USER ROLES
Student
Permissions
Create Profile
Edit Profile
Generate Prediction
View Reports
View Recommendations
Placement Officer
Permissions
View Students
View Analytics
Manage Companies
Generate Reports
Admin
Permissions
Manage Users
Manage Companies
Manage Roles
View Global Analytics
System Configuration
RBAC MATRIX
Action
Student
Officer
Admin
Profile
✓
✓
✓
Prediction
✓
✗
✓
Companies
✗
✓
✓
Reports
✗
✓
✓
Users
✗
✗
✓
4. FUNCTIONAL MODULES
AUTHENTICATION MODULE
Purpose
Secure user access.
Features
Registration 
Login 
Logout 
Reset Password 
Email Verification 
API
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/reset-password
Database
users
UI
Login Page 
Register Page 
Forgot Password 
STUDENT PROFILE MODULE
Purpose
Store placement-related data.
Features
Profile Creation 
Profile Editing 
Skill Tracking 
API
GET /student/profile
PUT /student/profile
Database
student_profiles
UI
Multi-step form
ACADEMIC DATA MODULE
Features
CGPA 
Backlogs 
Branch 
Certifications 
API
PUT /student/academic
PLACEMENT PREDICTION ENGINE
Purpose
Predict placement probability.
Features
Probability Score 
Status 
Explainability 
API
POST /predict
Response
{
  "probability": 87.6,
  "status": "Placed",
  "explanation": {}
}
ELIGIBILITY CHECKER
Purpose
Check eligibility for company drives.
Features
CGPA filtering 
Backlog filtering 
API
POST /eligibility/check
COMPANY MANAGEMENT
Features
Add Company 
Edit Company 
Eligibility Criteria 
API
POST /companies
GET /companies
PUT /companies/:id
DELETE /companies/:id
ANALYTICS DASHBOARD
Features
Placement Trends 
Skill Distribution 
Branch Comparison 
Charts
Bar Chart 
Pie Chart 
Radar Chart 
Heatmap 
REPORTS MODULE
Features
PDF Reports 
CSV Export 
NOTIFICATIONS
Features
Prediction Completed 
New Company Drive 
Eligibility Alerts 
ADMIN PANEL
Features
User Management 
Role Management 
Audit Logs 
5. DATABASE DESIGN
users
id UUID PRIMARY KEY
email TEXT UNIQUE
role TEXT
created_at TIMESTAMP
Indexes
CREATE INDEX idx_users_email
ON users(email);
student_profiles
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
branch TEXT
college_tier INTEGER
cgpa NUMERIC
backlogs INTEGER
coding_skills INTEGER
dsa_score INTEGER
aptitude_score INTEGER
communication_skills INTEGER
ml_knowledge INTEGER
system_design INTEGER
internships INTEGER
projects_count INTEGER
certifications INTEGER
hackathons INTEGER
open_source_contributions INTEGER
extracurriculars INTEGER
updated_at TIMESTAMP
predictions
id UUID PRIMARY KEY
student_id UUID REFERENCES users(id)
probability NUMERIC
status TEXT
model_version TEXT
created_at TIMESTAMP
companies
id UUID PRIMARY KEY
name TEXT
min_cgpa NUMERIC
max_backlogs INTEGER
description TEXT
created_at TIMESTAMP
reports
id UUID PRIMARY KEY
generated_by UUID
report_type TEXT
file_url TEXT
notifications
id UUID PRIMARY KEY
user_id UUID
title TEXT
message TEXT
is_read BOOLEAN
6. API DESIGN
Register
POST /auth/register
Request
{
  "email": "user@gmail.com",
  "password": "password"
}
Validation
email required
password >= 8 chars
Authorization
Public
Login
POST /auth/login
Response
{
  "token":"jwt"
}
Prediction
POST /predict
Request
{
  "branch":"CSE",
  "cgpa":8.5,
  "coding_skills":80
}
Validation
cgpa 0-10
skills 0-100
Authorization
Student
Get Analytics
GET /analytics
Authorization
Officer/Admin
7. MACHINE LEARNING ARCHITECTURE
Input Features
branch
college_tier
cgpa
backlogs
coding_skills
dsa_score
aptitude_score
communication_skills
ml_knowledge
system_design
internships
projects_count
certifications
hackathons
open_source_contributions
extracurriculars
Preprocessing
Missing Value Handling
↓
Validation
↓
One Hot Encoding
↓
Feature Scaling
Feature Engineering
Derived Metrics
Skill Index
Project Index
Industry Readiness Score
Training Workflow
Dataset
↓
Cleaning
↓
Encoding
↓
Train/Test Split
↓
Logistic Regression
↓
Evaluation
↓
Joblib Export
Evaluation Metrics
Accuracy
Precision
Recall
F1
ROC AUC
Confusion Matrix
Prediction Workflow
Input
↓
Validation
↓
Encoder
↓
Model
↓
Probability
↓
Classification
Model Update Strategy
Quarterly Retraining
Performance Monitoring
Model Versioning
A/B Testing
8. SECURITY REQUIREMENTS
Authentication Flow
Email Login
↓
Supabase Auth
↓
JWT
↓
Protected APIs
Row Level Security
Students
user_id = auth.uid()
Officers
Can view assigned students
Admin
Full Access
Input Validation
Frontend
Zod
Backend
Pydantic
Rate Limiting
Prediction API
30 requests/minute
Auth
10 requests/minute
9. UI/UX REQUIREMENTS
Pages
Landing
Login
Register
Dashboard
Profile
Prediction
Analytics
Companies
Admin
Navigation
Sidebar
Top Navbar
Breadcrumbs
Dashboard Layout
Header
Metrics
Charts
Recent Activity
Forms
Use:
React Hook Form
Zod
Tables
Features:
Sorting
Pagination
Filtering
Export
Responsive
Mobile
Tablet
Desktop
Accessibility
WCAG AA
Requirements
Keyboard Navigation
Screen Reader Support
Contrast Ratio
10. NON-FUNCTIONAL REQUIREMENTS
Performance
Prediction
< 2 sec
API
< 500 ms
Scalability
10000+
students
Availability
99.9%
Security
OWASP Top 10 Compliance
Maintainability
Modular Architecture
Type Safety
Unit Testing
11. FOLDER STRUCTURE
src/
├── app/
│
├── pages/
│   ├── dashboard/
│   ├── prediction/
│   ├── profile/
│   ├── analytics/
│
├── components/
│   ├── ui/
│   ├── charts/
│   ├── forms/
│
├── features/
│   ├── auth/
│   ├── students/
│   ├── predictions/
│   ├── analytics/
│
├── services/
│   ├── api/
│   ├── supabase/
│
├── hooks/
│
├── store/
│
├── types/
│
├── lib/
│
├── utils/
│
├── constants/
│
└── assets/
Backend
backend/
├── api/
├── routes/
├── controllers/
├── services/
├── repositories/
├── models/
├── schemas/
├── middleware/
├── utils/
├── ml/
│   ├── model.joblib
│   ├── encoder.joblib
│   └── predict.py
12. DEVELOPMENT ROADMAP
Phase 1 — MVP
Auth 
Student Profile 
Prediction Form 
ML API 
Phase 2 — Core Features
Analytics 
Companies 
Eligibility Checker 
Phase 3 — ML Integration
Explainability 
Recommendations 
Model Monitoring 
Phase 4 — Production
Security Hardening 
Monitoring 
CI/CD 
Performance Optimization 
13. AI DEVELOPMENT INSTRUCTIONS (ANTIGRAVITY)
Build Order
1. Initialize React + TypeScript project
2. Configure Supabase
3. Implement Auth
4. Create RBAC middleware
5. Create database schema
6. Build Student Profile forms
7. Build Prediction API integration
8. Connect FastAPI ML service
9. Build Analytics dashboard
10. Add SHAP explainability
11. Add Notifications
12. Implement Reports
13. Configure monitoring
14. Deploy production environment
Code Standards
Strict TypeScript
ESLint
Prettier
Feature-based architecture
100% API typing
React Query for server state
Zustand for client state
Required Deliverables
Production-ready React application
Supabase migrations
FastAPI ML service
Role-based access control
Responsive UI
Analytics dashboards
CI/CD configuration
Docker support
Comprehensive documentation