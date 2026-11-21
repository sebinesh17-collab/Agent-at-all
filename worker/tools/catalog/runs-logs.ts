import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'runs.logs',
  title: "Read run logs",
  description: "Reads execution logs for a run.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('runs.logs', input);
}
