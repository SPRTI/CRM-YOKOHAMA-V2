CREATE TABLE IF NOT EXISTS audit_logs (
  id text PRIMARY KEY,
  entity_type text NOT NULL,
  entity_id text NULL,
  action text NOT NULL,
  actor text NULL,
  payload jsonb NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type_created_at ON audit_logs(entity_type, created_at DESC);
