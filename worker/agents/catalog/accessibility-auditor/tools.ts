export const allowedTools = [
  "code.read",
  "security.scan",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
