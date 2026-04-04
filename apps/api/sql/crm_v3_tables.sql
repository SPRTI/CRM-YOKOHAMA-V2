-- Tablas recomendadas para la siguiente fase del CRM

CREATE TABLE IF NOT EXISTS chat_controls (
  phone TEXT PRIMARY KEY,
  bot_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  human_takeover BOOLEAN NOT NULL DEFAULT FALSE,
  assigned_to TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bot_blacklist (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL UNIQUE,
  reason TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_notes (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  note TEXT NOT NULL,
  created_by TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_notes_phone_created_at ON chat_notes(phone, created_at DESC);
