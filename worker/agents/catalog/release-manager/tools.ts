export const allowedTools = [
  "runs.status",
  "code.test",
  "writing.document"
] as const;
export type AllowedTool = typeof allowedTools[number];
