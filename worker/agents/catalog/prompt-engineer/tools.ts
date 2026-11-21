export const allowedTools = [
  "code.read",
  "code.write",
  "code.test"
] as const;
export type AllowedTool = typeof allowedTools[number];
