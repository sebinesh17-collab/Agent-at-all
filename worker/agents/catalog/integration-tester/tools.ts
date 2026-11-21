export const allowedTools = [
  "code.test",
  "terminal.exec",
  "runs.logs"
] as const;
export type AllowedTool = typeof allowedTools[number];
