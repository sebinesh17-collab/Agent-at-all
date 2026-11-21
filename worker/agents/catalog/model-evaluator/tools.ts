export const allowedTools = [
  "models.compare",
  "data.analyze",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
