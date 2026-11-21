import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'queue.inspect',
  title: "Inspect queue",
  description: "Reads job state and queue metadata.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('queue.inspect', input);
}
