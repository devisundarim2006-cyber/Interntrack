import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  skills: string[];
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  preferred_roles: string[];
  preferred_locations: string[];
  experience_level: string;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type Opportunity = {
  id: string;
  type: 'internship' | 'hackathon' | 'competition' | 'scholarship' | 'fellowship';
  title: string;
  company_id: string | null;
  company: string | null;
  company_logo_url: string | null;
  description: string | null;
  location: string | null;
  work_mode: 'remote' | 'hybrid' | 'onsite' | null;
  salary: string | null;
  salary_currency: string;
  duration: string | null;
  skills_required: string[];
  eligibility: string | null;
  application_url: string;
  deadline: string | null;
  start_date: string | null;
  end_date: string | null;
  prize_pool: string | null;
  team_size: string | null;
  difficulty: string | null;
  tags: string[];
  source: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Application = {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: 'wishlist' | 'applied' | 'interview' | 'assessment' | 'offer' | 'rejected';
  applied_at: string | null;
  notes: string | null;
  resume_used: string | null;
  cover_letter: string | null;
  timeline: { status: string; date: string }[];
  created_at: string;
  updated_at: string;
  opportunity?: Opportunity;
};

export type SavedOpportunity = {
  id: string;
  user_id: string;
  opportunity_id: string;
  notes: string | null;
  created_at: string;
  opportunity?: Opportunity;
};

export type Company = {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  description: string | null;
  industry: string | null;
  size: string | null;
  tech_stack: string[];
  location: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  created_at: string;
  updated_at: string;
};
