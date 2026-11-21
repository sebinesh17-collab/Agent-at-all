export const allowedTools = [
  "code.test",
  "terminal.exec",
  "files.read",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
