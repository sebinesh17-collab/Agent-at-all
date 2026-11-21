export const allowedTools = [
  "data.analyze",
  "charts.create",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
