-- Migration: 20260907_init_schema.sql
-- Placement Intelligence Platform Schema

-- 1. Profiles Table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'officer', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Student Profiles (Academic & Skill Data)
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    branch TEXT NOT NULL CHECK (branch IN ('CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'Chemical')),
    college_tier TEXT NOT NULL CHECK (college_tier IN ('Tier-1', 'Tier-2', 'Tier-3')),
    cgpa NUMERIC(4, 2) NOT NULL CHECK (cgpa >= 0.0 AND cgpa <= 10.0),
    backlogs INTEGER NOT NULL DEFAULT 0 CHECK (backlogs >= 0),
    coding_skills INTEGER NOT NULL CHECK (coding_skills BETWEEN 1 AND 10),
    dsa_score INTEGER NOT NULL CHECK (dsa_score BETWEEN 1 AND 10),
    aptitude_score INTEGER NOT NULL CHECK (aptitude_score BETWEEN 0 AND 100),
    communication_skills INTEGER NOT NULL CHECK (communication_skills BETWEEN 1 AND 10),
    ml_knowledge INTEGER NOT NULL CHECK (ml_knowledge BETWEEN 0 AND 10),
    system_design INTEGER NOT NULL CHECK (system_design BETWEEN 0 AND 10),
    internships INTEGER NOT NULL DEFAULT 0 CHECK (internships >= 0),
    projects_count INTEGER NOT NULL DEFAULT 0 CHECK (projects_count >= 0),
    certifications INTEGER NOT NULL DEFAULT 0 CHECK (certifications >= 0),
    hackathons INTEGER NOT NULL DEFAULT 0 CHECK (hackathons >= 0),
    open_source_contributions INTEGER NOT NULL DEFAULT 0 CHECK (open_source_contributions >= 0),
    extracurriculars INTEGER NOT NULL DEFAULT 0 CHECK (extracurriculars >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Predictions History
CREATE TABLE IF NOT EXISTS public.predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    probability NUMERIC(5, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Placed', 'Not Placed')),
    input_features JSONB NOT NULL,
    factor_contributions JSONB NOT NULL,
    model_version TEXT DEFAULT 'logistic_regression_balanced_v1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Recommendations Table
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prediction_id UUID NOT NULL REFERENCES public.predictions(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Companies / Placement Drives
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    min_cgpa NUMERIC(4, 2) NOT NULL DEFAULT 6.0,
    max_backlogs INTEGER NOT NULL DEFAULT 0,
    eligible_branches TEXT[] DEFAULT ARRAY['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'Chemical'],
    package_lpa NUMERIC(5, 2),
    location TEXT,
    deadline DATE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Automated profile creation trigger on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        role = EXCLUDED.role;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin or officer
CREATE OR REPLACE FUNCTION public.is_officer_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('officer', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS: profiles
DROP POLICY IF EXISTS "Users can view own profile or officers can view all" ON public.profiles;
CREATE POLICY "Users can view own profile or officers can view all"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_officer_or_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_officer_or_admin());

DROP POLICY IF EXISTS "Allow user insert profile" ON public.profiles;
CREATE POLICY "Allow user insert profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id OR public.is_officer_or_admin());

-- RLS: student_profiles
DROP POLICY IF EXISTS "Students view own profile or officers view all" ON public.student_profiles;
CREATE POLICY "Students view own profile or officers view all"
    ON public.student_profiles FOR SELECT
    USING (auth.uid() = user_id OR public.is_officer_or_admin());

DROP POLICY IF EXISTS "Students update own profile" ON public.student_profiles;
CREATE POLICY "Students update own profile"
    ON public.student_profiles FOR ALL
    USING (auth.uid() = user_id OR public.is_officer_or_admin());

-- RLS: predictions
DROP POLICY IF EXISTS "Students view own predictions or officers view all" ON public.predictions;
CREATE POLICY "Students view own predictions or officers view all"
    ON public.predictions FOR SELECT
    USING (auth.uid() = user_id OR public.is_officer_or_admin());

DROP POLICY IF EXISTS "Students insert own prediction" ON public.predictions;
CREATE POLICY "Students insert own prediction"
    ON public.predictions FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_officer_or_admin());

-- RLS: recommendations
DROP POLICY IF EXISTS "View recommendations" ON public.recommendations;
CREATE POLICY "View recommendations"
    ON public.recommendations FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.predictions p
        WHERE p.id = recommendations.prediction_id
        AND (p.user_id = auth.uid() OR public.is_officer_or_admin())
    ));

DROP POLICY IF EXISTS "Insert recommendations" ON public.recommendations;
CREATE POLICY "Insert recommendations"
    ON public.recommendations FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.predictions p
        WHERE p.id = recommendations.prediction_id
        AND (p.user_id = auth.uid() OR public.is_officer_or_admin())
    ));

-- RLS: companies
DROP POLICY IF EXISTS "Anyone authenticated can view companies" ON public.companies;
CREATE POLICY "Anyone authenticated can view companies"
    ON public.companies FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Officers and admins can modify companies" ON public.companies;
CREATE POLICY "Officers and admins can modify companies"
    ON public.companies FOR ALL
    USING (public.is_officer_or_admin());

-- RLS: notifications
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;
CREATE POLICY "Users manage own notifications"
    ON public.notifications FOR ALL
    USING (auth.uid() = user_id);
