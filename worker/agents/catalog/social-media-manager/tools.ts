export const allowedTools = [
  "writing.document",
  "planning.tasks",
  "data.analyze"
] as const;
export type AllowedTool = typeof allowedTools[number];
