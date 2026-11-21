export const allowedTools = [
  "files.read",
  "writing.summarize",
  "planning.tasks"
] as const;
export type AllowedTool = typeof allowedTools[number];
