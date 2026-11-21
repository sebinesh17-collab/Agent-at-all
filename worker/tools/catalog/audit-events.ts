import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'audit.events',
  title: "Audit events",
  description: "Reads immutable audit records.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('audit.events', input);
}
