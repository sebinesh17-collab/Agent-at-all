export const allowedTools = [
  "web.search",
  "web.open",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
