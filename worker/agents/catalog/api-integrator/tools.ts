export const allowedTools = [
  "web.open",
  "code.write",
  "secrets.read",
  "terminal.exec"
] as const;
export type AllowedTool = typeof allowedTools[number];
