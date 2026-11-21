import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'queue.enqueue',
  title: "Enqueue job",
  description: "Enqueues a durable task message.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('queue.enqueue', input);
}
