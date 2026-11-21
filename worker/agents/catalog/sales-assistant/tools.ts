export const allowedTools = [
  "web.search",
  "writing.document",
  "crm.records"
] as const;
export type AllowedTool = typeof allowedTools[number];
