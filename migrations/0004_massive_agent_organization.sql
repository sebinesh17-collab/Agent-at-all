-- AETHER 16,111-agent organizational registry.
-- Logical agents are persisted as data; actual inference concurrency is controlled by queues/providers.
ALTER TABLE agents ADD COLUMN hierarchy_level TEXT NOT NULL DEFAULT 'worker';
ALTER TABLE agents ADD COLUMN category TEXT NOT NULL DEFAULT 'custom';
ALTER TABLE agents ADD COLUMN job_title TEXT NOT NULL DEFAULT 'Specialist';
ALTER TABLE agents ADD COLUMN manager_agent_id TEXT;
ALTER TABLE agents ADD COLUMN skills TEXT NOT NULL DEFAULT '[]';
ALTER TABLE agents ADD COLUMN permissions TEXT NOT NULL DEFAULT '[]';
ALTER TABLE agents ADD COLUMN memory_enabled INTEGER NOT NULL DEFAULT 1;
ALTER TABLE agents ADD COLUMN status TEXT NOT NULL DEFAULT 'idle';
ALTER TABLE agents ADD COLUMN current_task TEXT;
ALTER TABLE agents ADD COLUMN execution_limits TEXT NOT NULL DEFAULT '{}';
ALTER TABLE agents ADD COLUMN resource_budget TEXT NOT NULL DEFAULT '{}';
ALTER TABLE agents ADD COLUMN is_seeded INTEGER NOT NULL DEFAULT 0;
ALTER TABLE agents ADD COLUMN agent_index INTEGER;
ALTER TABLE agents ADD COLUMN department_code TEXT;
CREATE INDEX IF NOT EXISTS idx_agents_hierarchy ON agents(is_seeded, hierarchy_level, category);
CREATE INDEX IF NOT EXISTS idx_agents_manager ON agents(manager_agent_id);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status, enabled);

CREATE TABLE IF NOT EXISTS agent_messages (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  run_id TEXT,
  sender_agent_id TEXT NOT NULL,
  receiver_agent_id TEXT NOT NULL,
  message_type TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal',
  content_json TEXT NOT NULL,
  attachments_json TEXT NOT NULL DEFAULT '[]',
  delivery_status TEXT NOT NULL DEFAULT 'queued',
  retry_count INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  delivered_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_agent_messages_receiver ON agent_messages(receiver_agent_id, delivery_status, created_at);
CREATE INDEX IF NOT EXISTS idx_agent_messages_run ON agent_messages(run_id, created_at);

CREATE TABLE IF NOT EXISTS agent_memory (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  project_id TEXT,
  memory_type TEXT NOT NULL,
  content TEXT NOT NULL,
  importance INTEGER NOT NULL DEFAULT 50,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_agent_memory_lookup ON agent_memory(agent_id, project_id, importance DESC);

CREATE TABLE IF NOT EXISTS task_dependencies (
  task_id TEXT NOT NULL,
  depends_on_task_id TEXT NOT NULL,
  PRIMARY KEY(task_id, depends_on_task_id)
);

CREATE TABLE IF NOT EXISTS organization_seed_state (
  id INTEGER PRIMARY KEY CHECK(id = 1),
  target_count INTEGER NOT NULL,
  seeded_count INTEGER NOT NULL,
  completed_at INTEGER
);

-- Generate a 0..99,999 integer range using a Cartesian product, avoiding recursive CTE depth limits.
WITH digits(n) AS (VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9)),
nums(n) AS (
  SELECT d0.n + d1.n*10 + d2.n*100 + d3.n*1000 + d4.n*10000
  FROM digits d0 CROSS JOIN digits d1 CROSS JOIN digits d2 CROSS JOIN digits d3 CROSS JOIN digits d4
),
org(id,name,role,provider,model,system_prompt,hierarchy_level,category,job_title,manager_agent_id,skills,permissions,allowed_tools,agent_index,department_code) AS (
  SELECT 'master-leader-001','Master Leader','Chief Autonomous Development Officer','openai','gpt-4.1-mini',
    'You are the single Master Leader of AETHER. Own the global objective, create the strategy, coordinate all ten Principals, resolve cross-department conflicts, manage risk and budgets, inspect evidence, and approve delivery. Never claim completion without verified test/build evidence. Agent identity: master-leader-001.',
    'master','executive','Chief Autonomous Development Officer',NULL,
    '["systems_architecture","project_planning","multi_agent_orchestration","risk_management"]',
    '["organization.read","organization.manage","project.plan","task.assign","budget.approve","release.approve"]',
    '["agents.status","agents.dispatch","task.decompose","task.assign","runs.status","runs.logs","provider.health","billing.usage"]',1,'EXEC'
  UNION ALL
  SELECT printf('principal-%03d',n),printf('Principal Agent %03d',n),'Department Director','openai','gpt-4.1-mini',
    'You are Principal Agent '||printf('%03d',n)||'. Manage your assigned ten HODs, convert the Master Leader strategy into departmental milestones, coordinate dependencies, review deliverables, manage resource budgets, and report evidence-based progress. Department index: '||CAST(n AS TEXT)||'.',
    'principal','department_'||printf('%02d',n),'Department Director','master-leader-001',
    '["department_strategy","task_decomposition","technical_review","resource_planning"]',
    '["department.read","department.manage","task.assign","agent.message","deliverable.review"]',
    '["agents.status","agents.dispatch","task.decompose","task.assign","runs.status","runs.logs"]',n,'D'||printf('%02d',n)
  FROM nums WHERE n BETWEEN 1 AND 10
  UNION ALL
  SELECT printf('hod-%03d',n),printf('HOD Agent %03d',n),'Technical Department Head','openai','gpt-4.1-mini',
    'You are HOD Agent '||printf('%03d',n)||'. Manage ten Team Leaders, plan technical work, define interfaces and acceptance criteria, review code and test evidence, coordinate dependencies, and escalate blockers. Department index: '||CAST(((n-1)/10)+1 AS TEXT)||'. HOD index: '||CAST(n AS TEXT)||'.',
    'hod','department_'||printf('%02d',((n-1)/10)+1),'Technical Department Head',printf('principal-%03d',((n-1)/10)+1),
    '["technical_planning","code_review","dependency_management","quality_assurance"]',
    '["department.read","team.manage","task.assign","agent.message","deliverable.review"]',
    '["agents.status","task.decompose","task.assign","task.validate","runs.status","runs.logs"]',n,'D'||printf('%02d',((n-1)/10)+1)
  FROM nums WHERE n BETWEEN 1 AND 100
  UNION ALL
  SELECT printf('team-leader-%04d',n),printf('Team Leader %04d',n),'Development Team Manager','openai','gpt-4.1-mini',
    'You are Team Leader '||printf('%04d',n)||'. Coordinate fifteen Worker Agents. Break approved work into non-overlapping assignments, define file ownership, track dependencies, review patches, run checks, prevent duplicate edits, and report verified outcomes to your HOD. Team index: '||CAST(n AS TEXT)||'.',
    'team_leader','department_'||printf('%02d',((n-1)/100)+1),'Development Team Manager',printf('hod-%03d',((n-1)/10)+1),
    '["work_breakdown","git_branching","patch_review","integration_testing"]',
    '["team.read","worker.assign","task.assign","agent.message","patch.review"]',
    '["agents.status","task.create","task.assign","task.complete","git.status","git.diff","code.review"]',n,'D'||printf('%02d',((n-1)/100)+1)
  FROM nums WHERE n BETWEEN 1 AND 1000
  UNION ALL
  SELECT printf('worker-%05d',n),
    (CASE (n % 25)
      WHEN 0 THEN 'Frontend Engineer' WHEN 1 THEN 'Backend Engineer' WHEN 2 THEN 'Full-Stack Engineer' WHEN 3 THEN 'API Engineer' WHEN 4 THEN 'Database Engineer'
      WHEN 5 THEN 'AI Engineer' WHEN 6 THEN 'Machine Learning Engineer' WHEN 7 THEN 'Linux Engineer' WHEN 8 THEN 'DevOps Engineer' WHEN 9 THEN 'Cloud Engineer'
      WHEN 10 THEN 'Security Engineer' WHEN 11 THEN 'QA Engineer' WHEN 12 THEN 'Debugger' WHEN 13 THEN 'Code Reviewer' WHEN 14 THEN 'UI UX Designer'
      WHEN 15 THEN 'Android Engineer' WHEN 16 THEN 'Compiler Engineer' WHEN 17 THEN 'Documentation Engineer' WHEN 18 THEN 'Performance Engineer' WHEN 19 THEN 'Deployment Engineer'
      WHEN 20 THEN 'Git Engineer' WHEN 21 THEN 'Research Analyst' WHEN 22 THEN 'Automation Engineer' WHEN 23 THEN 'Integration Engineer' ELSE 'Data Engineer' END)||' '||printf('%05d',n),
    'Specialist Execution Worker','openai','gpt-4.1-mini',
    'You are Worker Agent '||printf('%05d',n)||'. Your specialized category is '||
    (CASE (n % 25)
      WHEN 0 THEN 'frontend development' WHEN 1 THEN 'backend development' WHEN 2 THEN 'full-stack development' WHEN 3 THEN 'API engineering' WHEN 4 THEN 'database engineering'
      WHEN 5 THEN 'AI engineering' WHEN 6 THEN 'machine learning' WHEN 7 THEN 'Linux systems' WHEN 8 THEN 'DevOps' WHEN 9 THEN 'cloud engineering'
      WHEN 10 THEN 'security engineering' WHEN 11 THEN 'quality assurance' WHEN 12 THEN 'debugging' WHEN 13 THEN 'code review' WHEN 14 THEN 'UI and UX design'
      WHEN 15 THEN 'Android development' WHEN 16 THEN 'compiler engineering' WHEN 17 THEN 'technical documentation' WHEN 18 THEN 'performance optimization' WHEN 19 THEN 'deployment'
      WHEN 20 THEN 'Git and GitHub' WHEN 21 THEN 'technical research' WHEN 22 THEN 'automation' WHEN 23 THEN 'integration testing' ELSE 'data engineering' END)||
    '. Execute only your assigned work package. Inspect relevant files first, respect file ownership and project conventions, use authorized tools only, test changes, preserve existing behavior, report errors and evidence, and submit a concise result to your Team Leader. Unique worker shard: '||CAST(n AS TEXT)||'.',
    'worker',
    CASE (n % 25)
      WHEN 0 THEN 'frontend_development' WHEN 1 THEN 'backend_development' WHEN 2 THEN 'full_stack_development' WHEN 3 THEN 'api_development' WHEN 4 THEN 'database_engineering'
      WHEN 5 THEN 'ai_engineering' WHEN 6 THEN 'machine_learning' WHEN 7 THEN 'linux_infrastructure' WHEN 8 THEN 'devops' WHEN 9 THEN 'cloud_engineering'
      WHEN 10 THEN 'security_engineering' WHEN 11 THEN 'testing_qa' WHEN 12 THEN 'debugging' WHEN 13 THEN 'code_review' WHEN 14 THEN 'ui_ux_design'
      WHEN 15 THEN 'android_development' WHEN 16 THEN 'compiler_engineering' WHEN 17 THEN 'documentation' WHEN 18 THEN 'performance_optimization' WHEN 19 THEN 'deployment'
      WHEN 20 THEN 'git_github' WHEN 21 THEN 'research' WHEN 22 THEN 'automation' WHEN 23 THEN 'integration' ELSE 'data_engineering' END,
    'Specialist Execution Worker',printf('team-leader-%04d',((n-1)/15)+1),
    CASE (n % 25)
      WHEN 0 THEN '["React","Next.js","TypeScript","CSS","accessibility"]' WHEN 1 THEN '["Node.js","Python","REST APIs","authentication"]' WHEN 2 THEN '["React","Node.js","database design","testing"]'
      WHEN 3 THEN '["OpenAPI","REST","OAuth","API testing"]' WHEN 4 THEN '["SQL","schema design","migrations","indexing"]' WHEN 5 THEN '["LLM integration","tool calling","prompt engineering"]'
      WHEN 6 THEN '["Python","model evaluation","data pipelines"]' WHEN 7 THEN '["Linux","shell","process management"]' WHEN 8 THEN '["CI/CD","containers","observability"]'
      WHEN 9 THEN '["Cloudflare","Firebase","object storage","infrastructure"]' WHEN 10 THEN '["threat modeling","secure coding","access control"]' WHEN 11 THEN '["unit tests","integration tests","E2E"]'
      WHEN 12 THEN '["debugging","stack traces","root cause analysis"]' WHEN 13 THEN '["code review","refactoring","architecture"]' WHEN 14 THEN '["design systems","responsive UI","usability"]'
      WHEN 15 THEN '["Kotlin","Android SDK","Gradle"]' WHEN 16 THEN '["C","C++","LLVM","build systems"]' WHEN 17 THEN '["README","API docs","technical writing"]'
      WHEN 18 THEN '["profiling","load testing","optimization"]' WHEN 19 THEN '["release engineering","deployment","health checks"]' WHEN 20 THEN '["Git","branches","merges","releases"]'
      WHEN 21 THEN '["documentation research","source verification","technical analysis"]' WHEN 22 THEN '["workflow automation","background jobs","scheduling"]'
      WHEN 23 THEN '["service integration","contract tests","compatibility"]' ELSE '["ETL","data validation","data transformation"]' END,
    '["task.read","task.update","agent.message","files.read","files.write","code.read","code.write","code.test"]',
    CASE (n % 25)
      WHEN 0 THEN '["code.read","code.write","files.read","files.write","terminal.exec","web.search"]'
      WHEN 1 THEN '["code.read","code.write","files.read","files.write","terminal.exec","database.query"]'
      WHEN 2 THEN '["code.read","code.write","files.read","files.write","terminal.exec","code.test"]'
      WHEN 3 THEN '["code.read","code.write","web.search","web.open","terminal.exec"]'
      WHEN 4 THEN '["database.query","database.migrate","files.read","files.write","code.review"]'
      WHEN 5 THEN '["web.search","web.open","models.compare","files.read","files.write"]'
      WHEN 6 THEN '["web.search","data.analyze","data.transform","terminal.exec"]'
      WHEN 7 THEN '["terminal.exec","terminal.files","files.read","files.write"]'
      WHEN 8 THEN '["terminal.exec","git.status","git.diff","code.test","cloudflare.deploy"]'
      WHEN 9 THEN '["web.search","web.open","files.read","files.write","storage.upload"]'
      WHEN 10 THEN '["security.scan","code.read","code.review","web.search"]'
      WHEN 11 THEN '["code.test","terminal.exec","files.read","files.write"]'
      WHEN 12 THEN '["code.read","terminal.exec","web.search","files.write"]'
      WHEN 13 THEN '["code.read","code.review","git.diff","files.read"]'
      WHEN 14 THEN '["design.review","design.tokens","files.read","files.write"]'
      WHEN 15 THEN '["terminal.exec","code.read","code.write","code.test"]'
      WHEN 16 THEN '["terminal.exec","package.install","code.test","web.search"]'
      WHEN 17 THEN '["writing.document","writing.markdown","files.read","files.write"]'
      WHEN 18 THEN '["data.analyze","terminal.exec","code.test","web.search"]'
      WHEN 19 THEN '["terminal.exec","cloudflare.deploy","git.status","web.open"]'
      WHEN 20 THEN '["git.status","git.diff","git.branch","git.commit"]'
      WHEN 21 THEN '["web.search","web.open","web.extract","files.write"]'
      WHEN 22 THEN '["scheduler.create","workflow.start","terminal.exec"]'
      WHEN 23 THEN '["web.search","web.open","code.test","files.read"]'
      ELSE '["data.analyze","data.transform","database.query","files.write"]' END,
    n,'D'||printf('%02d',((n-1)/1500)+1)
  FROM nums WHERE n BETWEEN 1 AND 15000
)
INSERT OR IGNORE INTO agents (
  id,name,role,provider,model,system_prompt,enabled,allowed_tools,max_parallel_tasks,
  hierarchy_level,category,job_title,manager_agent_id,skills,permissions,memory_enabled,status,
  execution_limits,resource_budget,is_seeded,agent_index,department_code
)
SELECT id,name,role,provider,model,system_prompt,1,allowed_tools,
  CASE hierarchy_level WHEN 'worker' THEN 1 WHEN 'team_leader' THEN 2 ELSE 4 END,
  hierarchy_level,category,job_title,manager_agent_id,skills,permissions,1,'idle',
  '{"timeout_seconds":120,"max_tool_calls":8,"max_retries":2}',
  '{"max_tokens_per_task":12000,"max_cost_usd_per_task":0.25}',1,agent_index,department_code
FROM org;

INSERT OR REPLACE INTO organization_seed_state(id,target_count,seeded_count,completed_at)
SELECT 1,16111,COUNT(*),CAST(strftime('%s','now') AS INTEGER)*1000 FROM agents WHERE is_seeded=1;

ALTER TABLE runs ADD COLUMN completed_tasks INTEGER NOT NULL DEFAULT 0;
ALTER TABLE runs ADD COLUMN failed_tasks INTEGER NOT NULL DEFAULT 0;
ALTER TABLE runs ADD COLUMN pending_tasks INTEGER NOT NULL DEFAULT 0;
ALTER TABLE runs ADD COLUMN fanout_complete INTEGER NOT NULL DEFAULT 0;
ALTER TABLE runs ADD COLUMN synthesis_json TEXT;

CREATE TABLE IF NOT EXISTS run_agent_assignments (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  ordinal INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  workflow_instance_id TEXT,
  error_text TEXT,
  created_at INTEGER NOT NULL,
  started_at INTEGER,
  completed_at INTEGER,
  UNIQUE(run_id, agent_id)
);
CREATE INDEX IF NOT EXISTS idx_run_assignments_pending ON run_agent_assignments(run_id, status, ordinal);
CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_runs_unique ON agent_runs(run_id, agent_id);
ALTER TABLE agents ADD COLUMN last_active_at INTEGER;

CREATE TABLE IF NOT EXISTS workspace_file_locks (
  user_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  acquired_at INTEGER NOT NULL,
  lease_until INTEGER NOT NULL,
  PRIMARY KEY(user_id,run_id,file_path)
);
CREATE INDEX IF NOT EXISTS idx_workspace_file_locks_agent ON workspace_file_locks(run_id,agent_id);
UPDATE agents SET allowed_tools=json_insert(json_insert(allowed_tools,'$[#]','agent.message'),'$[#]','agent.inbox') WHERE is_seeded=1;
ALTER TABLE runs ADD COLUMN plan_json TEXT;

UPDATE agents SET system_prompt = 'You are the single Master Leader of AETHER. First analyze the user objective and create a concrete project strategy. Before delegating, return a JSON object with keys summary and work_packages. Each work_packages item must contain department_code (D01-D10), category (use a specific specialist category such as frontend_development, backend_development, api_development, database_engineering, ai_engineering, linux_infrastructure, devops, cloud_engineering, security_engineering, testing_qa, ui_ux_design, documentation, performance_optimization, deployment, git_github, research, automation, integration, data_engineering, or department_01 through department_10), task (a distinct actionable work package), and acceptance_criteria (array). Create enough non-overlapping packages to let teams work in parallel. Do not claim code was written or tests passed unless evidence exists. Agent identity: master-leader-001.' WHERE id='master-leader-001';
ALTER TABLE runs ADD COLUMN running_tasks INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS agent_tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  run_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  manager_agent_id TEXT,
  priority TEXT NOT NULL DEFAULT 'normal',
  description TEXT NOT NULL,
  dependencies_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL,
  started_at INTEGER,
  completed_at INTEGER,
  output_json TEXT,
  error_text TEXT
);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_run_status ON agent_tasks(run_id,status,created_at);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_agent ON agent_tasks(agent_id,status,created_at);
UPDATE agents SET allowed_tools=json_insert(json_insert(json_insert(json_insert(allowed_tools,'$[#]','agent.create'),'$[#]','agent.update'),'$[#]','agent.delete'),'$[#]','agents.status') WHERE is_seeded=1 AND hierarchy_level IN ('master','principal','hod','team_leader');

UPDATE agents SET allowed_tools=json_insert(allowed_tools,'$[#]','agents.dispatch') WHERE is_seeded=1 AND hierarchy_level IN ('master','principal','hod','team_leader');

UPDATE agents SET allowed_tools=json_insert(json_insert(json_insert(allowed_tools,'$[#]','task.complete'),'$[#]','task.block'),'$[#]','task.validate') WHERE is_seeded=1;
UPDATE agents SET allowed_tools=json_insert(allowed_tools,'$[#]','task.create') WHERE is_seeded=1 AND hierarchy_level IN ('master','principal','hod','team_leader');
ALTER TABLE runs ADD COLUMN artifact_key TEXT;
ALTER TABLE runs ADD COLUMN artifact_size INTEGER;
ALTER TABLE runs ADD COLUMN archive_status TEXT;
CREATE TABLE IF NOT EXISTS download_tokens (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  object_key TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  max_downloads INTEGER NOT NULL DEFAULT 5,
  downloads INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_download_tokens_expiry ON download_tokens(expires_at);
