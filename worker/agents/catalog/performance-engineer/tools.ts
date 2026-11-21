export const allowedTools = [
  "terminal.exec",
  "data.analyze",
  "code.review"
] as const;
export type AllowedTool = typeof allowedTools[number];
