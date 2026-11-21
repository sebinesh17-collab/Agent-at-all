export const allowedTools = [
  "planning.roadmap",
  "planning.tasks",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
