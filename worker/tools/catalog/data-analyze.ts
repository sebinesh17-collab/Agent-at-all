import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'data.analyze',
  title: "Analyze dataset",
  description: "Computes basic descriptive statistics for tabular JSON data.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('data.analyze', input);
}
