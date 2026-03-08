-- ============================================
-- CritiqUX — Migration 002
-- Storage Buckets, Missing RLS, Helper RPCs
-- ============================================

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Design uploads bucket (private — signed URLs only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'design-uploads',
  'design-uploads',
  FALSE,
  10485760, -- 10 MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Avatars bucket (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  TRUE,
  2097152, -- 2 MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Reports bucket (private — exported PDFs/HTML)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'reports',
  'reports',
  FALSE,
  52428800, -- 50 MB
  ARRAY['application/pdf', 'text/html']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- design-uploads: owner can CRUD within their folder
CREATE POLICY "Users can upload designs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'design-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own designs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'design-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own designs" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'design-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- avatars: authenticated upload own, public read
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- reports: project owner can read
CREATE POLICY "Users can view own reports" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'reports' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- MISSING RLS POLICIES (from migration 001)
-- ============================================

-- AB Tests: via project access
CREATE POLICY "Users can view ab tests" ON ab_tests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = ab_tests.project_id
      AND (projects.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM team_members WHERE project_id = projects.id AND user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can create ab tests" ON ab_tests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects WHERE id = ab_tests.project_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete ab tests" ON ab_tests
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects WHERE id = ab_tests.project_id AND owner_id = auth.uid()
    )
  );

-- Analysis Reports: service role INSERT (API-only), owner DELETE
CREATE POLICY "Service can insert analysis reports" ON analysis_reports
  FOR INSERT WITH CHECK (TRUE); -- API routes use service role key

CREATE POLICY "Users can delete analysis reports" ON analysis_reports
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM designs
      JOIN projects ON projects.id = designs.project_id
      WHERE designs.id = analysis_reports.design_id
      AND projects.owner_id = auth.uid()
    )
  );

-- ============================================
-- HELPER RPCs
-- ============================================

-- Monthly credit reset (called by cron or webhook)
CREATE OR REPLACE FUNCTION reset_monthly_credits()
RETURNS void AS $$
BEGIN
  -- Reset free plan users to 10 credits
  UPDATE credits
  SET balance = 10
  FROM profiles
  WHERE credits.user_id = profiles.id
  AND profiles.subscription_plan = 'free';

  -- Reset pro plan users to 200 credits
  UPDATE credits
  SET balance = 200
  FROM profiles
  WHERE credits.user_id = profiles.id
  AND profiles.subscription_plan = 'pro';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user dashboard stats
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS TABLE (
  total_projects BIGINT,
  total_analyses BIGINT,
  avg_ux_score NUMERIC,
  credits_remaining INTEGER,
  analyses_today INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM projects WHERE owner_id = p_user_id)::BIGINT,
    (SELECT COUNT(*) FROM analysis_reports ar
     JOIN designs d ON d.id = ar.design_id
     JOIN projects p ON p.id = d.project_id
     WHERE p.owner_id = p_user_id)::BIGINT,
    (SELECT COALESCE(AVG(ar.ux_score), 0)
     FROM analysis_reports ar
     JOIN designs d ON d.id = ar.design_id
     JOIN projects p ON p.id = d.project_id
     WHERE p.owner_id = p_user_id)::NUMERIC,
    (SELECT c.balance FROM credits c WHERE c.user_id = p_user_id),
    (SELECT c.daily_used FROM credits c WHERE c.user_id = p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get monthly usage breakdown
CREATE OR REPLACE FUNCTION get_monthly_usage(p_user_id UUID, p_months INTEGER DEFAULT 6)
RETURNS TABLE (
  month TEXT,
  analysis_count BIGINT,
  total_tokens BIGINT,
  total_cost NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(DATE_TRUNC('month', al.created_at), 'YYYY-MM') AS month,
    COUNT(*)::BIGINT AS analysis_count,
    SUM(al.tokens_used)::BIGINT AS total_tokens,
    SUM(al.cost_usd)::NUMERIC AS total_cost
  FROM ai_usage_logs al
  WHERE al.user_id = p_user_id
  AND al.created_at >= DATE_TRUNC('month', NOW()) - (p_months || ' months')::INTERVAL
  GROUP BY DATE_TRUNC('month', al.created_at)
  ORDER BY DATE_TRUNC('month', al.created_at) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate a unique feedback link token
CREATE OR REPLACE FUNCTION generate_feedback_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'hex');
END;
$$ LANGUAGE plpgsql;
