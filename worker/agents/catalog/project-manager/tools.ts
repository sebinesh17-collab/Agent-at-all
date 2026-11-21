export const allowedTools = [
  "planning.tasks",
  "agents.dispatch",
  "runs.status",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
