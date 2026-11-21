export const allowedTools = [
  "web.search",
  "data.analyze",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
