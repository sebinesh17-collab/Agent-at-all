export const allowedTools = [
  "agents.dispatch",
  "agents.status",
  "runs.status",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
