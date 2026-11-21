export const allowedTools = [
  "writing.document",
  "planning.tasks",
  "files.read"
] as const;
export type AllowedTool = typeof allowedTools[number];
