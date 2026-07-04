/*
# InternHub Initial Schema

This migration creates the foundational database structure for InternHub, a platform that aggregates internships, hackathons, coding competitions, scholarships, and fellowships.

## Tables Created:

1. **profiles** - User profiles extending Supabase auth.users
   - id (uuid, PK, references auth.users)
   - email (text, unique)
   - full_name (text)
   - avatar_url (text)
   - resume_url (text)
   - skills (text array)
   - github_url (text)
   - linkedin_url (text)
   - portfolio_url (text)
   - preferred_roles (text array)
   - preferred_locations (text array)
   - experience_level (text)
   - created_at, updated_at (timestamps)

2. **opportunities** - Core opportunity listings (internships, hackathons, competitions, scholarships, fellowships)
   - id (uuid, PK)
   - type (text) - 'internship', 'hackathon', 'competition', 'scholarship', 'fellowship'
   - title (text)
   - company (text)
   - company_logo_url (text)
   - description (text)
   - location (text)
   - work_mode (text) - 'remote', 'hybrid', 'onsite'
   - salary (text)
   - salary_currency (text)
   - duration (text)
   - skills_required (text array)
   - eligibility (text)
   - application_url (text)
   - deadline (timestamptz)
   - start_date (timestamptz)
   - end_date (timestamptz)
   - prize_pool (text) - for hackathons/competitions
   - team_size (text) - for hackathons
   - difficulty (text) - for competitions
   - tags (text array)
   - source (text) - where the opportunity was found
   - is_featured (boolean)
   - is_active (boolean)
   - created_at, updated_at (timestamps)

3. **saved_opportunities** - User bookmarks
   - id (uuid, PK)
   - user_id (uuid, FK to profiles)
   - opportunity_id (uuid, FK to opportunities)
   - notes (text)
   - created_at (timestamp)

4. **applications** - Application tracking
   - id (uuid, PK)
   - user_id (uuid, FK to profiles)
   - opportunity_id (uuid, FK to opportunities)
   - status (text) - 'wishlist', 'applied', 'interview', 'assessment', 'offer', 'rejected'
   - applied_at (timestamptz)
   - notes (text)
   - resume_used (text)
   - cover_letter (text)
   - timeline (jsonb) - array of status changes with timestamps
   - created_at, updated_at (timestamps)

5. **companies** - Company information
   - id (uuid, PK)
   - name (text, unique)
   - logo_url (text)
   - website (text)
   - description (text)
   - industry (text)
   - size (text)
   - tech_stack (text array)
   - location (text)
   - linkedin_url (text)
   - github_url (text)
   - created_at, updated_at (timestamps)

6. **categories** - Opportunity categories and tags
   - id (uuid, PK)
   - name (text)
   - slug (text, unique)
   - type (text)
   - created_at (timestamp)

## Security:
- RLS enabled on all tables
- Owner-scoped policies for saved_opportunities and applications
- Profiles can be read by authenticated users, updated by owner
- Opportunities and companies are readable by all
*/

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  resume_url text,
  skills text[] DEFAULT '{}',
  github_url text,
  linkedin_url text,
  portfolio_url text,
  preferred_roles text[] DEFAULT '{}',
  preferred_locations text[] DEFAULT '{}',
  experience_level text DEFAULT 'entry',
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  logo_url text,
  website text,
  description text,
  industry text,
  size text,
  tech_stack text[] DEFAULT '{}',
  location text,
  linkedin_url text,
  github_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('internship', 'hackathon', 'competition', 'scholarship', 'fellowship')),
  title text NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  company text,
  company_logo_url text,
  description text,
  location text,
  work_mode text CHECK (work_mode IN ('remote', 'hybrid', 'onsite', null)),
  salary text,
  salary_currency text DEFAULT 'USD',
  duration text,
  skills_required text[] DEFAULT '{}',
  eligibility text,
  application_url text NOT NULL,
  deadline timestamptz,
  start_date timestamptz,
  end_date timestamptz,
  prize_pool text,
  team_size text,
  difficulty text,
  tags text[] DEFAULT '{}',
  source text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create saved_opportunities table
CREATE TABLE IF NOT EXISTS saved_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, opportunity_id)
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'wishlist' CHECK (status IN ('wishlist', 'applied', 'interview', 'assessment', 'offer', 'rejected')),
  applied_at timestamptz,
  notes text,
  resume_used text,
  cover_letter text,
  timeline jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, opportunity_id)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert" ON profiles;
CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update" ON profiles;
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Companies policies (readable by all)
DROP POLICY IF EXISTS "companies_select" ON companies;
CREATE POLICY "companies_select" ON companies FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "companies_insert" ON companies;
CREATE POLICY "companies_insert" ON companies FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "companies_update" ON companies;
CREATE POLICY "companies_update" ON companies FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Opportunities policies (readable by all)
DROP POLICY IF EXISTS "opportunities_select" ON opportunities;
CREATE POLICY "opportunities_select" ON opportunities FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "opportunities_insert" ON opportunities;
CREATE POLICY "opportunities_insert" ON opportunities FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "opportunities_update" ON opportunities;
CREATE POLICY "opportunities_update" ON opportunities FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Saved opportunities policies (owner-scoped)
DROP POLICY IF EXISTS "saved_select_own" ON saved_opportunities;
CREATE POLICY "saved_select_own" ON saved_opportunities FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_insert_own" ON saved_opportunities;
CREATE POLICY "saved_insert_own" ON saved_opportunities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_delete_own" ON saved_opportunities;
CREATE POLICY "saved_delete_own" ON saved_opportunities FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Applications policies (owner-scoped)
DROP POLICY IF EXISTS "applications_select_own" ON applications;
CREATE POLICY "applications_select_own" ON applications FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "applications_insert_own" ON applications;
CREATE POLICY "applications_insert_own" ON applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "applications_update_own" ON applications;
CREATE POLICY "applications_update_own" ON applications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "applications_delete_own" ON applications;
CREATE POLICY "applications_delete_own" ON applications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Categories policies (readable by all)
DROP POLICY IF EXISTS "categories_select" ON categories;
CREATE POLICY "categories_select" ON categories FOR SELECT TO anon, authenticated USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_company ON opportunities(company);
CREATE INDEX IF NOT EXISTS idx_opportunities_location ON opportunities(location);
CREATE INDEX IF NOT EXISTS idx_opportunities_work_mode ON opportunities(work_mode);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_is_active ON opportunities(is_active);
CREATE INDEX IF NOT EXISTS idx_opportunities_is_featured ON opportunities(is_featured);
CREATE INDEX IF NOT EXISTS idx_opportunities_skills ON opportunities USING GIN(skills_required);
CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_opportunities_updated_at ON opportunities;
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, slug, type) VALUES
  ('Technology', 'technology', 'industry'),
  ('Finance', 'finance', 'industry'),
  ('Healthcare', 'healthcare', 'industry'),
  ('Education', 'education', 'industry'),
  ('E-commerce', 'ecommerce', 'industry'),
  ('Media', 'media', 'industry'),
  ('Consulting', 'consulting', 'industry'),
  ('Manufacturing', 'manufacturing', 'industry'),
  ('AI/ML', 'ai-ml', 'skill'),
  ('Web Development', 'web-development', 'skill'),
  ('Mobile Development', 'mobile-development', 'skill'),
  ('Data Science', 'data-science', 'skill'),
  ('DevOps', 'devops', 'skill'),
  ('Cybersecurity', 'cybersecurity', 'skill'),
  ('Cloud Computing', 'cloud-computing', 'skill'),
  ('Backend', 'backend', 'skill'),
  ('Frontend', 'frontend', 'skill'),
  ('Full Stack', 'full-stack', 'skill')
ON CONFLICT (slug) DO NOTHING;