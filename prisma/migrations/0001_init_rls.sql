-- Production PostgreSQL / Supabase schema for MyBizCar.
-- Apply in the SQL editor or via prisma migrate.
-- File-store remains the local/dev adapter when DATABASE_URL is unset.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  password_hash text NOT NULL,
  is_demo boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  industry text NOT NULL,
  stage text NOT NULL,
  size text NOT NULL,
  is_demo boolean NOT NULL DEFAULT false,
  confidentiality_note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  UNIQUE (organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS standard_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  name text NOT NULL,
  version text NOT NULL,
  status text NOT NULL,
  effective_date date NOT NULL,
  approval_note text NOT NULL,
  change_reason text NOT NULL,
  impact_note text NOT NULL,
  development_disclaimer text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  UNIQUE (code, version)
);

CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  parent_assessment_id uuid REFERENCES assessments(id),
  revision_number int NOT NULL DEFAULT 1,
  title text NOT NULL,
  status text NOT NULL,
  standard_version_id uuid NOT NULL REFERENCES standard_versions(id),
  primary_evaluator_id uuid NOT NULL REFERENCES users(id),
  secondary_evaluator_id uuid REFERENCES users(id),
  assessment_date date NOT NULL,
  next_review_date date,
  is_demo boolean NOT NULL DEFAULT false,
  locked_at timestamptz,
  locked_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid NOT NULL,
  organization_id uuid,
  assessment_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  old_value text,
  new_value text,
  reason text,
  standard_version_id uuid,
  ip text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Tenant isolation: a user sees only rows of organizations they belong to,
-- unless they hold SUPER_ADMIN on any membership.
CREATE POLICY org_member_select ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members m
      WHERE m.user_id = auth.uid()
        AND (
          m.organization_id = organizations.id
          OR m.role = 'SUPER_ADMIN'
        )
    )
  );

CREATE POLICY assessment_member_select ON assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members m
      WHERE m.user_id = auth.uid()
        AND (
          m.organization_id = assessments.organization_id
          OR m.role = 'SUPER_ADMIN'
        )
    )
  );
