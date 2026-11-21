export const allowedTools = [
  "writing.document",
  "writing.rewrite",
  "writing.grammar"
] as const;
export type AllowedTool = typeof allowedTools[number];
