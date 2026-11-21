export const allowedTools = [
  "web.search",
  "data.analyze",
  "planning.roadmap"
] as const;
export type AllowedTool = typeof allowedTools[number];
