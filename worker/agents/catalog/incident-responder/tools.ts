export const allowedTools = [
  "runs.logs",
  "terminal.exec",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
