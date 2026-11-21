export const allowedTools = [
  "files.read",
  "data.transform",
  "database.query",
  "terminal.exec"
] as const;
export type AllowedTool = typeof allowedTools[number];
