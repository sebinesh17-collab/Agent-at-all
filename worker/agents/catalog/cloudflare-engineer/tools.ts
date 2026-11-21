export const allowedTools = [
  "code.read",
  "code.write",
  "terminal.exec",
  "cloudflare.deploy"
] as const;
export type AllowedTool = typeof allowedTools[number];
