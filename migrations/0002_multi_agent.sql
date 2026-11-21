ALTER TABLE api_keys ADD COLUMN endpoint TEXT;
ALTER TABLE api_keys ADD COLUMN default_model TEXT;
ALTER TABLE runs ADD COLUMN user_id TEXT;
ALTER TABLE runs ADD COLUMN started_at INTEGER;
ALTER TABLE runs ADD COLUMN result_json TEXT;
ALTER TABLE runs ADD COLUMN error_text TEXT;
CREATE TABLE IF NOT EXISTS agent_runs (
 id TEXT PRIMARY KEY,
 run_id TEXT NOT NULL,
 agent_id TEXT NOT NULL,
 status TEXT NOT NULL,
 output_json TEXT,
 error_text TEXT,
 created_at INTEGER NOT NULL,
 completed_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_agent_runs_run ON agent_runs(run_id);
CREATE INDEX IF NOT EXISTS idx_runs_user_created ON runs(user_id,created_at);
CREATE TABLE IF NOT EXISTS prompt_versions (
 id TEXT PRIMARY KEY,
 agent_id TEXT NOT NULL,
 version INTEGER NOT NULL,
 prompt TEXT NOT NULL,
 created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS workspace_artifacts (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL,
 key TEXT NOT NULL,
 backend TEXT NOT NULL,
 created_at INTEGER NOT NULL
);

ALTER TABLE api_keys ADD COLUMN cooldown_until INTEGER;
ALTER TABLE runs ADD COLUMN email_status TEXT;
ALTER TABLE runs ADD COLUMN email_error TEXT;
