export const allowedTools = [
  "code.review",
  "web.search",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
