export const allowedTools = [
  "web.search",
  "web.open",
  "web.extract"
] as const;
export type AllowedTool = typeof allowedTools[number];
