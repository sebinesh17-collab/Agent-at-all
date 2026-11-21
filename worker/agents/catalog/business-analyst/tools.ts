export const allowedTools = [
  "data.analyze",
  "planning.roadmap",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
