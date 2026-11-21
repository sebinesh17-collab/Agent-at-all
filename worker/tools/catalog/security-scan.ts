import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'security.scan',
  title: "Security source scan",
  description: "Scans code for common dangerous patterns and exposed credentials.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('security.scan', input);
}
