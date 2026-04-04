CREATE TABLE IF NOT EXISTS incident_state (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  severity TEXT NOT NULL DEFAULT 'low',
  branch TEXT,
  summary TEXT,
  source_alert_id INTEGER,
  last_alert_at TIMESTAMP,
  last_message_at TIMESTAMP,
  assigned_to TEXT,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incident_state_phone_status ON incident_state(phone, status);

CREATE TABLE IF NOT EXISTS incident_events (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB,
  created_by TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incident_events_incident_created ON incident_events(incident_id, created_at);

CREATE TABLE IF NOT EXISTS order_drafts (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  customer_name TEXT,
  branch TEXT,
  service_type TEXT,
  items_summary TEXT,
  delivery_address TEXT,
  payment_method TEXT,
  observations TEXT,
  status TEXT NOT NULL DEFAULT 'pending_validation',
  source_message_id TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_drafts_phone_updated ON order_drafts(phone, updated_at);

CREATE TABLE IF NOT EXISTS reservation_drafts (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  customer_name TEXT,
  branch TEXT,
  people_count INTEGER,
  reservation_date TEXT,
  reservation_time TEXT,
  observations TEXT,
  status TEXT NOT NULL DEFAULT 'pending_validation',
  source_message_id TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservation_drafts_phone_updated ON reservation_drafts(phone, updated_at);
