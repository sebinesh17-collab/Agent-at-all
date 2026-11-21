export const allowedTools = [
  "files.read",
  "writing.document",
  "writing.markdown",
  "code.review"
] as const;
export type AllowedTool = typeof allowedTools[number];
