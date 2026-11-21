export interface AgentWorkflowPayload {
  runId: string;
  userId: string;
  agentId: string;
  callbackEmail?: string;
}

export interface FanoutMessage {
  kind: 'plan' | 'fanout';
  runId: string;
  userId: string;
  task: string;
  callbackEmail?: string;
  offset: number;
}

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  TASK_QUEUE: Queue<FanoutMessage>;
  AGENT_WORKFLOW: WorkflowBinding<AgentWorkflowPayload>;
  ARTIFACTS: R2Bucket;
  AGENT_COORDINATOR: DurableObjectNamespace;
  LINUX_RUNNER: DurableObjectNamespace;
  AUTH_SECRET: string;
  ENCRYPTION_KEY: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  COMPLETION_EMAIL_TO?: string;
  FIREBASE_STORAGE_BUCKET?: string;
  FIREBASE_STORAGE_TOKEN?: string;
  WEB_SEARCH_API_KEY?: string;
  ALLOW_WORKSPACE_INTERNET?: string;
  WORKSPACE_INSTANCE?: string;
  PUBLIC_APP_URL?: string;
}

export interface JobMessage { runId: string; userId: string; task: string; callbackEmail?: string; agentIds?: string[]; }
