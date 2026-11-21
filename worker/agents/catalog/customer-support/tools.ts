export const allowedTools = [
  "files.search",
  "web.search",
  "writing.rewrite"
] as const;
export type AllowedTool = typeof allowedTools[number];
