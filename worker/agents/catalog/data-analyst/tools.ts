export const allowedTools = [
  "files.read",
  "data.analyze",
  "data.transform",
  "charts.create"
] as const;
export type AllowedTool = typeof allowedTools[number];
