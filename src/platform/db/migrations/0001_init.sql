-- VABIX platform schema. Idempotent via schema_migrations in the migrator.
-- SQLite. Foreign keys ON. Do not store secrets or raw tokens in audit payloads.

CREATE TABLE IF NOT EXISTS schema_migrations (
  id TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  parent_id TEXT REFERENCES departments(id),
  lead_user_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT,
  updated_by TEXT,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT,
  avatar_file_id TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'mod', 'user')),
  department_id TEXT REFERENCES departments(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'locked', 'archived')),
  last_login_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT,
  updated_by TEXT,
  archived_at TEXT,
  is_seed INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);

CREATE TABLE IF NOT EXISTS permission_groups (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  is_seed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT,
  updated_by TEXT,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS permission_group_members (
  group_id TEXT NOT NULL REFERENCES permission_groups(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL,
  created_by TEXT,
  PRIMARY KEY (group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_pgm_user ON permission_group_members(user_id);

CREATE TABLE IF NOT EXISTS permission_group_grants (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES permission_groups(id) ON DELETE CASCADE,
  menu_code TEXT NOT NULL,
  action TEXT NOT NULL,
  scope TEXT NOT NULL CHECK (scope IN ('self', 'assigned', 'department', 'all')),
  UNIQUE (group_id, menu_code, action)
);

CREATE INDEX IF NOT EXISTS idx_pgg_group ON permission_group_grants(group_id);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON auth_sessions(user_id, revoked_at);

CREATE TABLE IF NOT EXISTS auth_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  purpose TEXT NOT NULL CHECK (purpose IN ('activation', 'reset')),
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL,
  created_by TEXT
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  summary TEXT NOT NULL,
  metadata TEXT NOT NULL DEFAULT '{}',
  ip TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT
);

CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  original_name TEXT NOT NULL,
  stored_name TEXT NOT NULL,
  mime TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'class', 'submission', 'task', 'profile', 'internal')),
  owner_user_id TEXT,
  class_id TEXT,
  alt_text TEXT NOT NULL DEFAULT '',
  used_as TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cms_documents (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'archived')),
  payload TEXT NOT NULL DEFAULT '{}',
  seo TEXT NOT NULL DEFAULT '{}',
  internal_notes TEXT NOT NULL DEFAULT '',
  featured INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  published_by TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  origin TEXT NOT NULL DEFAULT 'cms',
  is_seed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT,
  updated_by TEXT,
  archived_at TEXT,
  UNIQUE (type, slug)
);

CREATE INDEX IF NOT EXISTS idx_cms_type_status ON cms_documents(type, status);

CREATE TABLE IF NOT EXISTS cms_document_versions (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES cms_documents(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  payload TEXT NOT NULL,
  seo TEXT NOT NULL,
  internal_notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  created_by TEXT,
  UNIQUE (document_id, version)
);

CREATE TABLE IF NOT EXISTS learner_profiles (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  organization TEXT NOT NULL DEFAULT '',
  account_user_id TEXT UNIQUE REFERENCES users(id),
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT,
  updated_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_learners_email ON learner_profiles(email);

CREATE TABLE IF NOT EXISTS lms_courses (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  cover_file_id TEXT,
  description TEXT NOT NULL DEFAULT '',
  public_program_slug TEXT,
  audience TEXT NOT NULL DEFAULT '',
  objectives TEXT NOT NULL DEFAULT '[]',
  outcomes TEXT NOT NULL DEFAULT '[]',
  format TEXT NOT NULL DEFAULT 'blended' CHECK (format IN ('in_person', 'online', 'blended', 'self_paced')),
  duration_note TEXT NOT NULL DEFAULT '',
  prerequisites TEXT NOT NULL DEFAULT '',
  owner_user_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  completion_rules TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT,
  updated_by TEXT
);

CREATE TABLE IF NOT EXISTS lms_course_versions (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES lms_courses(id),
  version_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  summary TEXT NOT NULL DEFAULT '',
  completion_rules TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  created_by TEXT,
  published_at TEXT,
  UNIQUE (course_id, version_number)
);

CREATE TABLE IF NOT EXISTS lms_modules (
  id TEXT PRIMARY KEY,
  version_id TEXT NOT NULL REFERENCES lms_course_versions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  required INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_modules_version ON lms_modules(version_id, sort_order);

CREATE TABLE IF NOT EXISTS lms_lessons (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL REFERENCES lms_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL CHECK (kind IN ('article', 'video', 'pdf', 'slide', 'file', 'assignment', 'quiz', 'live', 'link')),
  body TEXT NOT NULL DEFAULT '',
  resource_url TEXT NOT NULL DEFAULT '',
  file_id TEXT,
  duration_minutes INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  required INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  unlock_rule TEXT NOT NULL DEFAULT 'immediate' CHECK (unlock_rule IN ('immediate', 'after_date', 'after_prerequisite')),
  unlock_at TEXT,
  prerequisite_lesson_id TEXT,
  completion_rule TEXT NOT NULL DEFAULT 'confirm' CHECK (completion_rule IN ('confirm', 'assignment', 'quiz', 'video_confirm', 'live_attendance', 'none')),
  assignment_id TEXT,
  quiz_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_lessons_module ON lms_lessons(module_id, sort_order);

CREATE TABLE IF NOT EXISTS lms_classes (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  public_program_slug TEXT,
  course_id TEXT NOT NULL REFERENCES lms_courses(id),
  version_id TEXT NOT NULL REFERENCES lms_course_versions(id),
  format TEXT NOT NULL DEFAULT 'blended',
  starts_on TEXT,
  ends_on TEXT,
  location TEXT NOT NULL DEFAULT '',
  meeting_url TEXT NOT NULL DEFAULT '',
  capacity INTEGER,
  status TEXT NOT NULL DEFAULT 'recruiting' CHECK (status IN ('recruiting', 'upcoming', 'in_progress', 'completed', 'archived')),
  access_until TEXT,
  completion_rules TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT,
  updated_by TEXT
);

CREATE TABLE IF NOT EXISTS lms_class_staff (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL REFERENCES lms_classes(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('instructor', 'assistant', 'coordinator')),
  created_at TEXT NOT NULL,
  created_by TEXT,
  UNIQUE (class_id, user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_class_staff_user ON lms_class_staff(user_id);

CREATE TABLE IF NOT EXISTS lms_enrollments (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL REFERENCES lms_classes(id),
  learner_profile_id TEXT NOT NULL REFERENCES learner_profiles(id),
  user_id TEXT REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'paused', 'withdrawn', 'expired')),
  enrolled_at TEXT NOT NULL,
  access_until TEXT,
  created_by TEXT,
  updated_at TEXT NOT NULL,
  UNIQUE (class_id, learner_profile_id)
);

CREATE INDEX IF NOT EXISTS idx_enroll_user ON lms_enrollments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_enroll_class ON lms_enrollments(class_id, status);

CREATE TABLE IF NOT EXISTS lms_schedules (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL REFERENCES lms_classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL,
  instructor_user_id TEXT,
  location TEXT NOT NULL DEFAULT '',
  meeting_url TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_schedules_class ON lms_schedules(class_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_schedules_instructor ON lms_schedules(instructor_user_id, starts_at);

CREATE TABLE IF NOT EXISTS lms_attendance (
  id TEXT PRIMARY KEY,
  schedule_id TEXT NOT NULL REFERENCES lms_schedules(id) ON DELETE CASCADE,
  enrollment_id TEXT NOT NULL REFERENCES lms_enrollments(id),
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'excused', 'late')),
  note TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL,
  updated_by TEXT,
  UNIQUE (schedule_id, enrollment_id)
);

CREATE TABLE IF NOT EXISTS lms_progress (
  id TEXT PRIMARY KEY,
  enrollment_id TEXT NOT NULL REFERENCES lms_enrollments(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES lms_lessons(id),
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  evidence_type TEXT NOT NULL DEFAULT 'none',
  completed_at TEXT,
  updated_at TEXT NOT NULL,
  UNIQUE (enrollment_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS lms_lesson_notes (
  id TEXT PRIMARY KEY,
  enrollment_id TEXT NOT NULL REFERENCES lms_enrollments(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES lms_lessons(id),
  body TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL,
  UNIQUE (enrollment_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS lms_assignments (
  id TEXT PRIMARY KEY,
  class_id TEXT REFERENCES lms_classes(id),
  version_id TEXT REFERENCES lms_course_versions(id),
  title TEXT NOT NULL,
  instructions TEXT NOT NULL DEFAULT '',
  file_id TEXT,
  mode TEXT NOT NULL DEFAULT 'individual' CHECK (mode IN ('individual', 'group')),
  opens_at TEXT,
  due_at TEXT,
  allow_late INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 1,
  submission_types TEXT NOT NULL DEFAULT '["text","file","link"]',
  rubric TEXT NOT NULL DEFAULT '[]',
  max_score REAL NOT NULL DEFAULT 100,
  weight REAL NOT NULL DEFAULT 1,
  required INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT
);

CREATE TABLE IF NOT EXISTS lms_study_groups (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL REFERENCES lms_classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lms_study_group_members (
  group_id TEXT NOT NULL REFERENCES lms_study_groups(id) ON DELETE CASCADE,
  enrollment_id TEXT NOT NULL REFERENCES lms_enrollments(id),
  created_at TEXT NOT NULL,
  PRIMARY KEY (group_id, enrollment_id)
);

CREATE TABLE IF NOT EXISTS lms_submissions (
  id TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL REFERENCES lms_assignments(id),
  enrollment_id TEXT NOT NULL REFERENCES lms_enrollments(id),
  study_group_id TEXT,
  member_snapshot TEXT NOT NULL DEFAULT '[]',
  version_no INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'returned', 'needs_revision', 'graded')),
  text_body TEXT NOT NULL DEFAULT '',
  link_url TEXT NOT NULL DEFAULT '',
  file_id TEXT,
  submitted_at TEXT,
  created_at TEXT NOT NULL,
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON lms_submissions(assignment_id, enrollment_id, version_no);

CREATE TABLE IF NOT EXISTS lms_grades (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES lms_submissions(id),
  rubric_scores TEXT NOT NULL DEFAULT '{}',
  score REAL,
  comment TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  graded_by TEXT,
  graded_at TEXT,
  change_reason TEXT NOT NULL DEFAULT '',
  UNIQUE (submission_id)
);

CREATE TABLE IF NOT EXISTS lms_grade_history (
  id TEXT PRIMARY KEY,
  grade_id TEXT NOT NULL REFERENCES lms_grades(id) ON DELETE CASCADE,
  score REAL,
  comment TEXT,
  status TEXT,
  changed_by TEXT,
  reason TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lms_eval_3w (
  id TEXT PRIMARY KEY,
  enrollment_id TEXT NOT NULL REFERENCES lms_enrollments(id),
  dimension TEXT NOT NULL CHECK (dimension IN ('WOW', 'WELL', 'WIN')),
  criteria TEXT NOT NULL DEFAULT '',
  evidence TEXT NOT NULL DEFAULT '',
  comment TEXT NOT NULL DEFAULT '',
  evaluator_user_id TEXT,
  evaluated_at TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  UNIQUE (enrollment_id, dimension)
);

CREATE TABLE IF NOT EXISTS lms_questions (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES lms_courses(id),
  module_id TEXT,
  prompt TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('single', 'multiple', 'boolean', 'essay')),
  options TEXT NOT NULL DEFAULT '[]',
  answer_key TEXT NOT NULL DEFAULT '[]',
  explanation TEXT NOT NULL DEFAULT '',
  points REAL NOT NULL DEFAULT 1,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lms_quizzes (
  id TEXT PRIMARY KEY,
  class_id TEXT REFERENCES lms_classes(id),
  version_id TEXT,
  title TEXT NOT NULL,
  opens_at TEXT,
  closes_at TEXT,
  duration_minutes INTEGER,
  max_attempts INTEGER NOT NULL DEFAULT 1,
  pass_score REAL,
  shuffle INTEGER NOT NULL DEFAULT 0,
  score_policy TEXT NOT NULL DEFAULT 'highest' CHECK (score_policy IN ('highest', 'latest')),
  reveal_policy TEXT NOT NULL DEFAULT 'after_close' CHECK (reveal_policy IN ('never', 'after_submit', 'after_close', 'after_grade')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  created_by TEXT
);

CREATE TABLE IF NOT EXISTS lms_quiz_items (
  quiz_id TEXT NOT NULL REFERENCES lms_quizzes(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES lms_questions(id),
  sort_order INTEGER NOT NULL DEFAULT 0,
  points REAL,
  PRIMARY KEY (quiz_id, question_id)
);

CREATE TABLE IF NOT EXISTS lms_attempts (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL REFERENCES lms_quizzes(id),
  enrollment_id TEXT NOT NULL REFERENCES lms_enrollments(id),
  attempt_no INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded', 'expired')),
  started_at TEXT NOT NULL,
  ends_at TEXT,
  submitted_at TEXT,
  score REAL,
  snapshot TEXT NOT NULL DEFAULT '[]',
  answer_key TEXT NOT NULL DEFAULT '[]',
  UNIQUE (quiz_id, enrollment_id, attempt_no)
);

CREATE TABLE IF NOT EXISTS lms_attempt_answers (
  attempt_id TEXT NOT NULL REFERENCES lms_attempts(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  answer TEXT NOT NULL DEFAULT '[]',
  auto_score REAL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (attempt_id, question_id)
);

CREATE TABLE IF NOT EXISTS lms_certificate_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  payload TEXT NOT NULL DEFAULT '{}',
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lms_certificates (
  id TEXT PRIMARY KEY,
  enrollment_id TEXT NOT NULL REFERENCES lms_enrollments(id),
  template_id TEXT REFERENCES lms_certificate_templates(id),
  template_snapshot TEXT NOT NULL DEFAULT '{}',
  code TEXT NOT NULL UNIQUE,
  verify_token TEXT NOT NULL UNIQUE,
  learner_name TEXT NOT NULL,
  program_name TEXT NOT NULL,
  class_name TEXT NOT NULL,
  issued_at TEXT,
  issued_by TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'issued', 'revoked', 'reissued')),
  revoke_reason TEXT NOT NULL DEFAULT '',
  pdf_file_id TEXT,
  created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cert_enrollment_issued ON lms_certificates(enrollment_id) WHERE status IN ('pending', 'issued');

CREATE TABLE IF NOT EXISTS discussions (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL REFERENCES lms_classes(id) ON DELETE CASCADE,
  lesson_id TEXT,
  title TEXT NOT NULL,
  created_at TEXT NOT NULL,
  created_by TEXT
);

CREATE TABLE IF NOT EXISTS discussion_posts (
  id TEXT PRIMARY KEY,
  discussion_id TEXT NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  parent_id TEXT,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL,
  created_by TEXT,
  updated_at TEXT,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  href TEXT NOT NULL DEFAULT '',
  ref_type TEXT,
  ref_id TEXT,
  read_at TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (user_id, type, ref_id)
);

CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id, created_at);

CREATE TABLE IF NOT EXISTS scheduled_notifications (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  ref_id TEXT NOT NULL,
  fire_at TEXT NOT NULL,
  processed_at TEXT,
  UNIQUE (type, ref_id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  creator_user_id TEXT NOT NULL REFERENCES users(id),
  assignee_user_id TEXT NOT NULL REFERENCES users(id),
  department_id TEXT REFERENCES departments(id),
  starts_on TEXT,
  due_on TEXT,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'waiting', 'done', 'cancelled')),
  linked_type TEXT,
  linked_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_creator ON tasks(creator_user_id, status);

CREATE TABLE IF NOT EXISTS task_collaborators (
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  PRIMARY KEY (task_id, user_id)
);

CREATE TABLE IF NOT EXISTS task_comments (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  file_id TEXT,
  created_at TEXT NOT NULL,
  created_by TEXT
);

CREATE TABLE IF NOT EXISTS task_checklist (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  source_path TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  organization TEXT NOT NULL DEFAULT '',
  role_title TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  program_slug TEXT,
  event_slug TEXT,
  assignee_user_id TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'processing', 'confirmed', 'linked', 'closed', 'spam')),
  notes TEXT NOT NULL DEFAULT '',
  next_contact_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status, created_at);

CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at TEXT NOT NULL
);
