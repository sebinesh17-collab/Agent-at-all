export const allowedTools = [
  "design.tokens",
  "design.review",
  "writing.document"
] as const;
export type AllowedTool = typeof allowedTools[number];
