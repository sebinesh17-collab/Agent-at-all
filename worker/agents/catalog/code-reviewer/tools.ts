export const allowedTools = [
  "code.read",
  "code.review",
  "code.test"
] as const;
export type AllowedTool = typeof allowedTools[number];
