export const allowedTools = [
  "code.read",
  "code.write",
  "code.review",
  "planning.tasks"
] as const;
export type AllowedTool = typeof allowedTools[number];
