export const allowedTools = [
  "code.read",
  "terminal.exec",
  "runs.logs"
] as const;
export type AllowedTool = typeof allowedTools[number];
