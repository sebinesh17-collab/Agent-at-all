export const allowedTools = [
  "database.query",
  "database.migrate",
  "code.review"
] as const;
export type AllowedTool = typeof allowedTools[number];
