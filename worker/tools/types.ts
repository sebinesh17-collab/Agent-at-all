export type ToolResult = { ok: boolean; data?: unknown; error?: string; artifactId?: string };
export type ToolContext = {
  userId: string;
  runId: string;
  agentId: string;
  services: { invoke: (toolId: string, input: Record<string, unknown>) => Promise<ToolResult> };
};
