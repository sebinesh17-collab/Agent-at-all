export const allowedTools = [
  "files.search",
  "files.read",
  "code.read"
] as const;
export type AllowedTool = typeof allowedTools[number];
