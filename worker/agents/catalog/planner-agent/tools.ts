export const allowedTools = [
  "planning.tasks",
  "planning.roadmap",
  "agents.dispatch"
] as const;
export type AllowedTool = typeof allowedTools[number];
