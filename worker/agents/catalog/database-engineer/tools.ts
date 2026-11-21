export const allowedTools = [
  "code.read",
  "code.write",
  "database.query",
  "database.migrate"
] as const;
export type AllowedTool = typeof allowedTools[number];
