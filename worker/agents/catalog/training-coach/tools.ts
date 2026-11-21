export const allowedTools = [
  "web.search",
  "writing.document",
  "planning.tasks"
] as const;
export type AllowedTool = typeof allowedTools[number];
