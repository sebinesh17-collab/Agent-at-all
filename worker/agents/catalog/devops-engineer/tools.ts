export const allowedTools = [
  "terminal.exec",
  "terminal.files",
  "cloudflare.deploy",
  "runs.status"
] as const;
export type AllowedTool = typeof allowedTools[number];
