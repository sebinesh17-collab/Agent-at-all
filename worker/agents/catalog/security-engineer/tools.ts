export const allowedTools = [
  "code.read",
  "code.review",
  "security.scan",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
