import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'runs.status',
  title: "Read run status",
  description: "Reads task progress and terminal state.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('runs.status', input);
}
