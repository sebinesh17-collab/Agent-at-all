export const allowedTools = [
  "writing.rewrite",
  "writing.grammar",
  "files.read"
] as const;
export type AllowedTool = typeof allowedTools[number];
