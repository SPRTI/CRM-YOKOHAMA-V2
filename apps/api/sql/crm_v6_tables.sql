CREATE TABLE IF NOT EXISTS bot_message_decisions (
  id BIGSERIAL PRIMARY KEY,
  phone TEXT NOT NULL,
  message_id TEXT,
  decision TEXT NOT NULL,
  reason TEXT,
  label TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bot_message_decisions_phone_created
  ON bot_message_decisions (phone, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bot_message_decisions_message_id
  ON bot_message_decisions (message_id);
