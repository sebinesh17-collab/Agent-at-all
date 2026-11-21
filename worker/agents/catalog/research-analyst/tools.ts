export const allowedTools = [
  "web.search",
  "web.open",
  "web.extract",
  "memory.read",
  "files.search"
] as const;
export type AllowedTool = typeof allowedTools[number];
