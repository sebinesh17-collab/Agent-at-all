export const allowedTools = [
  "files.search",
  "files.read",
  "files.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
