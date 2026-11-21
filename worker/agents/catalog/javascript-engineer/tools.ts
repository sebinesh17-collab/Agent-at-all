export const allowedTools = [
  "code.read",
  "code.write",
  "terminal.exec",
  "code.test"
] as const;
export type AllowedTool = typeof allowedTools[number];
