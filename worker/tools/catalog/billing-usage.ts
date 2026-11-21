import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'billing.usage',
  title: "Read usage",
  description: "Reads usage and execution metering records.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('billing.usage', input);
}
