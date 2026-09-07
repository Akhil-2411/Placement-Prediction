# System Architecture — PlaceIQ Placement Intelligence Platform

## 1. High-Level Architecture

PlaceIQ is structured as a decoupled, multi-tier Software-as-a-Service (SaaS) application designed for high throughput, statistical explainability, and role-based institutional access.

```
┌─────────────────────────────────────────────────────────────┐
│                    React 19 + TypeScript                    │
│                 Vite • Tailwind CSS • Recharts              │
│       Role Layouts: Student Portal • Placement Officer      │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
       Inference Requests               Auth & History
               │                               │
               ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│       FastAPI Backend       │ │        Supabase BaaS        │
│   Uvicorn • Pydantic v2     │ │   PostgreSQL 17 Database    │
│  22-Feature Inference Engine│ │   Row Level Security (RLS)  │
│ Log-Odds Attribution Model  │ │   JWT Authentication Engine │
└──────────────┬──────────────┘ └─────────────────────────────┘
               │
               ▼
┌─────────────────────────────┐
│  placement_model_balanced   │
│   Logistic Regression ML    │
│  Class-Weighted • Joblib    │
└─────────────────────────────┘
```

---

## 2. Machine Learning Pipeline & Explainability

### Model Specification
- **Algorithm:** Scikit-Learn `LogisticRegression` (`class_weight='balanced'`, `max_iter=1000`, `random_state=42`)
- **Training Dataset:** 100,000 engineering student placement records
- **Evaluation Accuracy:** Balanced classification between Placed (1) and Not Placed (0)
- **Serialization:** Joblib export `placement_model_balanced.joblib`

### Feature Transformation & Preprocessing
The model expects exactly 22 numerical features produced by one-hot dummy encoding with `drop_first=True`:
1. `cgpa` (4.0 – 10.0)
2. `backlogs` (0 – 5)
3. `coding_skills` (1 – 10)
4. `dsa_score` (1 – 10)
5. `aptitude_score` (0 – 100)
6. `communication_skills` (1 – 10)
7. `ml_knowledge` (0 – 10)
8. `system_design` (0 – 10)
9. `internships` (0 – 5)
10. `projects_count` (0 – 10)
11. `certifications` (0 – 5)
12. `hackathons` (0 – 5)
13. `open_source_contributions` (0 – 5)
14. `extracurriculars` (0 – 5)
15. `branch_CSE` (0 or 1)
16. `branch_Chemical` (0 or 1)
17. `branch_ECE` (0 or 1)
18. `branch_EE` (0 or 1)
19. `branch_IT` (0 or 1)
20. `branch_ME` (0 or 1)
21. `college_tier_Tier-2` (0 or 1)
22. `college_tier_Tier-3` (0 or 1)

*Note on Baseline Categories:*
- **Branch Baseline:** `CE` (Civil Engineering). When candidate branch is `CE`, all 6 dummy indicators are set to 0.
- **College Tier Baseline:** `Tier-1`. When candidate is from a Tier-1 institution, both `college_tier_Tier-2` and `college_tier_Tier-3` are set to 0.

### Mathematical Factor Attribution
Rather than applying arbitrary heuristics, PlaceIQ computes log-odds feature contributions directly from the linear decision function:
$$z = w_0 + \sum_{i=1}^{22} w_i x_i$$
$$\Delta z_i = w_i \cdot (x_i - \bar{x}_i)$$

Where $\bar{x}_i$ represents the population mean for feature $i$ computed from the 100,000-record benchmark dataset.

**Scientific Disclaimer:** Factor contributions quantify model statistical weights from historical data. They represent model associations rather than guaranteed deterministic causality.

---

## 3. Database Schema & Security (Supabase PostgreSQL)

- **`public.profiles`**: Extends `auth.users` with `full_name`, `role` (`student`, `officer`, `admin`), and timestamps.
- **`public.student_profiles`**: Persistent academic standing and skills per user.
- **`public.predictions`**: Stores timestamped prediction outcomes, probability, input snapshot, and factor attributions.
- **`public.recommendations`**: Concrete action plans linked to individual predictions.
- **`public.companies`**: Active recruitment drives with CGPA cutoffs, backlog allowances, package CTC, and deadline.
- **`public.notifications`**: In-app notifications for drive matches and assessment updates.

### Row Level Security (RLS) Policy Summary
- Students can only view and insert their own predictions, profiles, and recommendations (`auth.uid() = user_id`).
- Placement Officers and College Administrators possess global read permissions over student rosters and write permissions over company drives via security-definer helper `is_officer_or_admin()`.
