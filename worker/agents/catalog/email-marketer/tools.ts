export const allowedTools = [
  "writing.document",
  "email.send",
  "data.analyze"
] as const;
export type AllowedTool = typeof allowedTools[number];
