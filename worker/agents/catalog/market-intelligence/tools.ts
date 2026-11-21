export const allowedTools = [
  "web.search",
  "web.extract",
  "data.analyze",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
