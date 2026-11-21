export const allowedTools = [
  "planning.tasks",
  "data.analyze",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
