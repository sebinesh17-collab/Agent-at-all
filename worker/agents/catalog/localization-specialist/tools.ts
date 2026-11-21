export const allowedTools = [
  "writing.rewrite",
  "writing.grammar"
] as const;
export type AllowedTool = typeof allowedTools[number];
