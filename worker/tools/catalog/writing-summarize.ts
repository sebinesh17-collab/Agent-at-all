import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'writing.summarize',
  title: "Summarize content",
  description: "Produces a concise structured summary.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('writing.summarize', input);
}
