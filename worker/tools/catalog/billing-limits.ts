import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'billing.limits',
  title: "Read limits",
  description: "Reads configured workspace quotas.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('billing.limits', input);
}
