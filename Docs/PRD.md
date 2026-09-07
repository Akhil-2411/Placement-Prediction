Product Requirements Document (PRD)
Placement Prediction Web Application
Version: 1.0Product Type: AI-Powered Placement Prediction PlatformTarget Users: Students, Placement Officers, College AdministratorsML Model: Logistic Regression (Joblib Export)Deployment: Modern Full Stack SaaS Application
1. Executive Summary
The Placement Prediction Web Application is an AI-powered platform designed to help students evaluate their placement readiness and improve employability through data-driven insights.
The system leverages a machine learning model trained on historical placement-related data to predict:
Placement Probability (%) 
Placement Status (Placed / Not Placed) 
The platform provides personalized recommendations, analytics dashboards, institution-level insights, and placement readiness tracking.
The goal is to improve placement rates through early intervention and actionable intelligence.
2. Problem Statement
Students often do not know:
Their current placement readiness 
Which skills are impacting placement chances 
Areas requiring improvement 
Placement officers lack:
Data-driven student risk identification 
Batch-wise placement analytics 
Predictive placement forecasting 
Colleges lack:
Placement preparedness reports 
Skill gap analytics 
Department-wise placement predictions 
3. Goals and Objectives
Business Goals
Improve student placement success rates 
Enable data-driven placement planning 
Increase student engagement 
Product Goals
Predict placement outcomes accurately 
Explain prediction results 
Provide improvement recommendations 
Enable institutional analytics 
ML Goals
High prediction accuracy 
Transparent predictions 
Explainability support 
4. User Personas
Persona 1: Student
Goals
Know placement probability 
Improve weak areas 
Track progress 
Pain Points
No clarity on placement readiness 
No personalized guidance 
Persona 2: Placement Officer
Goals
Monitor student readiness 
Identify at-risk students 
Generate reports 
Persona 3: College Administrator
Goals
View institution-level analytics 
Compare departments 
Improve placement performance 
5. User Stories
Student
As a student, I want to enter my profile and receive placement predictions. 
As a student, I want improvement recommendations. 
As a student, I want to track progress over time. 
Placement Officer
As a placement officer, I want batch analytics. 
As a placement officer, I want student rankings. 
Admin
As an admin, I want system-wide reports. 
As an admin, I want user management. 
6. Functional Requirements
Authentication
Login 
Registration 
Forgot Password 
Email Verification 
Prediction
Input student profile 
Generate prediction 
Store prediction history 
Dashboard
Student Dashboard 
Placement Dashboard 
Admin Dashboard 
Analytics
Placement Trends 
Skill Gap Analysis 
7. Non-Functional Requirements
Availability
99.9% uptime
Scalability
Support 10,000+ users
Reliability
Prediction response < 2 sec
Maintainability
Modular architecture
8. Feature Breakdown
Feature
Description
Authentication
Login/Register
Prediction Engine
ML Prediction
Recommendation Engine
Improvement Suggestions
Analytics Dashboard
Insights
User Management
Role-based access
Reporting
Export Reports
9. Application Flow
Landing Page
      ↓
Register/Login
      ↓
Dashboard
      ↓
Student Profile Form
      ↓
Prediction Request
      ↓
ML Model
      ↓
Placement Probability
      ↓
Recommendations
      ↓
History & Analytics
10. End-to-End User Journey
Student
Register 
Complete Profile 
Submit Placement Data 
Receive Prediction 
View Insights 
Follow Recommendations 
Recheck Prediction 
11. Dashboard Requirements
Student Dashboard
Cards:
Placement Probability 
Placement Status 
Skill Score 
Improvement Index 
Charts:
Prediction History 
Skill Comparison 
Placement Officer Dashboard
Cards:
Total Students 
Ready Students 
At Risk Students 
Avg Placement Probability 
Admin Dashboard
Cards:
Total Colleges 
Total Students 
Placement Rate 
Active Users 
12. Student Module
Purpose
Provide personalized placement readiness assessment.
Features
Profile Management
Fields:
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
Prediction
Purpose:Generate placement probability.
Acceptance Criteria:
Prediction generated within 2 seconds. 
Result stored. 
UI:
Input Form 
Predict Button 
Result Card 
Backend:
Prediction Service 
Database:
Prediction Table 
13. Admin Module
Purpose
Manage platform operations.
Features
User Management
Acceptance Criteria
Create users 
Disable users 
Reset accounts 
Database
Users table 
14. Placement Officer Module
Purpose
Monitor student placement readiness.
Features
Student Search 
Batch Reports 
Risk Analysis 
Acceptance Criteria
View all assigned students 
Export reports 
15. ML Prediction Module
Purpose
Generate placement predictions.
Workflow
Input Features
      ↓
Validation
      ↓
One Hot Encoding
      ↓
Logistic Regression
      ↓
Probability
      ↓
Classification
Acceptance Criteria
Probability generated 
Status generated 
16. Prediction Explanation System
Purpose
Explain why a prediction occurred.
Features
Feature Importance
Example
CGPA: +12%
Internships: +8%
Backlogs: -15%
Technology
SHAP 
Feature Contribution Analysis 
UI
Contribution Graph 
Positive Factors 
Negative Factors 
17. Database Design
Database: Supabase PostgreSQL
18. API Requirements
REST APIs
Authentication APIs
Prediction APIs
Analytics APIs
Admin APIs
19. Authentication & Authorization
Roles:
Student
Placement Officer
Admin
Permissions Matrix
Action
Student
Officer
Admin
Predict
Yes
No
No
View Reports
No
Yes
Yes
Manage Users
No
No
Yes
20. Analytics Dashboard
Metrics:
Placement Probability Distribution 
Branch Wise Placement Rate 
CGPA Impact 
Skill Correlation 
21. Data Visualization Requirements
Charts:
Recharts
Pie Chart 
Bar Chart 
Area Chart 
Radar Chart 
Heatmap 
22. Future Scope
Phase 2
Resume Analyzer 
ATS Score 
Interview Readiness 
Phase 3
AI Career Coach 
Job Recommendations 
Company Matching 
Phase 4
Generative AI Mentor 
23. Technical Architecture
Frontend (React)
       ↓
Backend (FastAPI)
       ↓
Prediction Service
       ↓
Joblib ML Model
       ↓
Supabase PostgreSQL
24. Frontend Architecture
Tech Stack
React 15 
JavaScript 
TailwindCSS 
ShadCN UI 
React Query 
Architecture
Pages
Components
Hooks
Services
Store
25. Backend Architecture
FastAPI
Layers:
Routes
Controllers
Services
Repositories
Database
26. Supabase Integration
Services
Authentication
supabase.auth
Database
PostgreSQL
Storage
Reports
Exports
Realtime
Live Analytics
27. Deployment Architecture
Vercel
  ↓
React
Railway/Render
  ↓
FastAPI
Supabase
  ↓
Database
28. Security Requirements
Authentication
JWT
Security
HTTPS 
Rate Limiting 
SQL Injection Protection 
XSS Protection 
CSRF Protection 
Data Encryption
AES-256
29. Performance Requirements
Metric
Target
Page Load
<2 sec
Prediction
<2 sec
API Response
<500 ms
Dashboard Load
<3 sec
30. Responsive Design Requirements
Breakpoints
Mobile
Tablet
Desktop
Large Desktop
Support
320px+ 
768px+ 
1024px+ 
1440px+ 
31. Accessibility Requirements
WCAG 2.1 AA
Requirements
Keyboard Navigation 
Screen Reader Support 
Color Contrast 
Focus Indicators 
32. UI/UX Guidelines
Design Principles
Minimal 
Professional 
Data Driven 
Student Friendly 
Navigation
Sidebar
Topbar
Breadcrumbs
33. Color Palette and Design System
Primary
#2563EB
Secondary
#0EA5E9
Success
#10B981
Warning
#F59E0B
Error
#EF4444
Background
#F8FAFC
Dark
#0F172A
Typography
Inter
34. Folder Structure
placement-predictor/
frontend/
│
├── app/
├── components/
├── features/
├── hooks/
├── services/
├── store/
├── utils/
├── types/
backend/
│
├── api/
├── routes/
├── controllers/
├── services/
├── repositories/
├── models/
├── schemas/
├── middleware/
├── utils/
ml/
│
├── model.joblib
├── encoder.joblib
├── predict.py
database/
│
├── migrations/
├── seeds/
35. Database Schema
users
id UUID PK
name
email
password_hash
role
created_at
student_profiles
id UUID
user_id FK
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
updated_at
predictions
id UUID
student_id FK
probability
status
created_at
recommendations
id UUID
prediction_id FK
recommendation_text
36. API Endpoints
Auth
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
Student
GET /api/student/profile
PUT /api/student/profile
Prediction
POST /api/predict
GET /api/predictions
GET /api/predictions/:id
Analytics
GET /api/analytics/overview
GET /api/analytics/skills
GET /api/analytics/placement
Admin
GET /api/admin/users
POST /api/admin/users
DELETE /api/admin/users/:id
37. Success Metrics
Product Metrics
Monthly Active Users 
Daily Active Users 
Prediction Requests 
ML Metrics
Accuracy 
Precision 
Recall 
F1 Score 
ROC AUC 
Business Metrics
Placement Improvement % 
Student Engagement % 
38. Risks and Mitigations
Risk
Mitigation
Low Data Quality
Validation
Model Drift
Retraining
User Churn
Recommendations
Server Load
Caching
Security Issues
RBAC + Auditing
39. Development Roadmap
Phase 1 (Weeks 1–2)
Authentication 
Student Profile 
ML Integration 
Phase 2 (Weeks 3–4)
Prediction Dashboard 
Recommendation Engine 
Phase 3 (Weeks 5–6)
Placement Officer Module 
Admin Dashboard 
Phase 4 (Weeks 7–8)
Analytics 
Reporting 
Visualization 
Phase 5 (Weeks 9–10)
SHAP Explainability 
Optimization 
Production Deployment 
Recommended Production Tech Stack
Frontend
React 15 
JavaScript 
Tailwind CSS 
ShadCN UI 
Recharts 
React Query 
Backend
FastAPI 
Pydantic 
SQLAlchemy 
Alembic 
Database
Supabase PostgreSQL 
ML
Scikit-Learn 
Joblib 
SHAP 
DevOps
Vercel (Frontend) 
Render (Backend) 
Supabase 
GitHub Actions CI/CD