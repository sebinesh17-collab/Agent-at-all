export const allowedTools = [
  "code.read",
  "code.write",
  "code.test",
  "terminal.exec"
] as const;
export type AllowedTool = typeof allowedTools[number];
