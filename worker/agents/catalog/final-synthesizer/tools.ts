export const allowedTools = [
  "agents.status",
  "runs.status",
  "reports.write",
  "email.send"
] as const;
export type AllowedTool = typeof allowedTools[number];
