export const allowedTools = [
  "code.write",
  "terminal.exec",
  "planning.tasks"
] as const;
export type AllowedTool = typeof allowedTools[number];
