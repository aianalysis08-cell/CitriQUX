-- ============================================
-- CritiqUX — Initial Database Schema
-- Run against Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE subscription_plan AS ENUM ('free', 'pro');
CREATE TYPE source_type AS ENUM ('upload', 'url', 'figma');
CREATE TYPE team_role AS ENUM ('viewer', 'editor', 'admin');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');
CREATE TYPE analysis_type AS ENUM (
  'ux-analysis', 'ab-test', 'competitor-spy', 'redesign',
  'tokens', 'prototype', 'user-stories', 'contextual-questions'
);
CREATE TYPE feedback_severity AS ENUM ('critical', 'warning', 'suggestion');

-- ============================================
-- TABLES
-- ============================================

-- Profiles (linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  subscription_plan subscription_plan NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_owner ON projects(owner_id);

-- Designs
CREATE TABLE designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  source_type source_type NOT NULL DEFAULT 'upload',
  original_filename TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_designs_project ON designs(project_id);

-- Analysis Reports
CREATE TABLE analysis_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  analysis_type analysis_type NOT NULL,
  feedback JSONB NOT NULL DEFAULT '{}',
  scores JSONB NOT NULL DEFAULT '{}',
  ux_score INTEGER NOT NULL DEFAULT 0,
  ai_model TEXT NOT NULL DEFAULT 'gpt-4o',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analysis_reports_design ON analysis_reports(design_id);
CREATE INDEX idx_analysis_reports_created ON analysis_reports(created_at DESC);

-- A/B Tests
CREATE TABLE ab_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  design_a_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  design_b_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  objective TEXT,
  target_audience TEXT,
  winner TEXT,
  results JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Feedback
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  link_token TEXT NOT NULL UNIQUE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  tester_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_feedback_project ON feedback(project_id);
CREATE UNIQUE INDEX idx_feedback_token ON feedback(link_token);

-- Team Members
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role team_role NOT NULL DEFAULT 'viewer',
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status subscription_status NOT NULL DEFAULT 'active',
  plan subscription_plan NOT NULL DEFAULT 'free',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_subscriptions_user ON subscriptions(user_id);

-- Credits
CREATE TABLE credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  balance INTEGER NOT NULL DEFAULT 10,
  daily_used INTEGER NOT NULL DEFAULT 0,
  daily_reset_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE UNIQUE INDEX idx_credits_user ON credits(user_id);

-- AI Usage Logs
CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  cost_usd NUMERIC(10,6) NOT NULL DEFAULT 0,
  model TEXT NOT NULL DEFAULT 'gpt-4o',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_usage_user_date ON ai_usage_logs(user_id, created_at);

-- Stripe Events (idempotency)
CREATE TABLE stripe_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_stripe_events_event_id ON stripe_events(event_id);

-- AI Prompts (admin-managed)
CREATE TABLE ai_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_name TEXT NOT NULL UNIQUE,
  system_prompt TEXT NOT NULL,
  user_prompt_template TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, subscription_plan)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'free'
  );

  INSERT INTO credits (user_id, balance, daily_used, daily_reset_date)
  VALUES (NEW.id, 10, 0, CURRENT_DATE);

  INSERT INTO subscriptions (user_id, status, plan)
  VALUES (NEW.id, 'active', 'free');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Credit deduction RPC
CREATE OR REPLACE FUNCTION deduct_credit(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE credits
  SET balance = balance - 1, daily_used = daily_used + 1
  WHERE user_id = p_user_id AND balance > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_prompts ENABLE ROW LEVEL SECURITY;

-- Profiles: own row only
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Projects: owner or team member
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (
    owner_id = auth.uid() OR
    EXISTS (SELECT 1 FROM team_members WHERE project_id = projects.id AND user_id = auth.uid())
  );
CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (owner_id = auth.uid());

-- Designs: via project access
CREATE POLICY "Users can view designs" ON designs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = designs.project_id
      AND (projects.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM team_members WHERE project_id = projects.id AND user_id = auth.uid()
      ))
    )
  );
CREATE POLICY "Users can insert designs" ON designs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE id = designs.project_id AND owner_id = auth.uid())
  );

-- Analysis Reports: via design → project chain
CREATE POLICY "Users can view analysis reports" ON analysis_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM designs
      JOIN projects ON projects.id = designs.project_id
      WHERE designs.id = analysis_reports.design_id
      AND (projects.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM team_members WHERE project_id = projects.id AND user_id = auth.uid()
      ))
    )
  );

-- Feedback: project owner reads, anyone with token inserts
CREATE POLICY "Project owner can view feedback" ON feedback
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE id = feedback.project_id AND owner_id = auth.uid())
  );
CREATE POLICY "Anyone can submit feedback" ON feedback
  FOR INSERT WITH CHECK (TRUE);

-- Team Members
CREATE POLICY "Team members can view" ON team_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE id = team_members.project_id AND owner_id = auth.uid())
    OR user_id = auth.uid()
  );
CREATE POLICY "Project owner can manage team" ON team_members
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE id = team_members.project_id AND owner_id = auth.uid())
  );
CREATE POLICY "Project owner can remove team members" ON team_members
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM projects WHERE id = team_members.project_id AND owner_id = auth.uid())
  );

-- Subscriptions: own row
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- Credits: own row
CREATE POLICY "Users can view own credits" ON credits
  FOR SELECT USING (user_id = auth.uid());

-- AI Usage Logs: own rows
CREATE POLICY "Users can view own usage" ON ai_usage_logs
  FOR SELECT USING (user_id = auth.uid());

-- AI Prompts: public read
CREATE POLICY "Anyone can read active prompts" ON ai_prompts
  FOR SELECT USING (is_active = TRUE);
