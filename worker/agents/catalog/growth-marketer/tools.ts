export const allowedTools = [
  "data.analyze",
  "planning.tasks",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
