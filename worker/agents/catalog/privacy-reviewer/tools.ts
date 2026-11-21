export const allowedTools = [
  "code.review",
  "security.scan",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
