export const allowedTools = [
  "files.read",
  "writing.summarize",
  "reports.write"
] as const;
export type AllowedTool = typeof allowedTools[number];
