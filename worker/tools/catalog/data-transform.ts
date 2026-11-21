import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'data.transform',
  title: "Transform dataset",
  description: "Maps, filters, and normalizes JSON rows.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('data.transform', input);
}
