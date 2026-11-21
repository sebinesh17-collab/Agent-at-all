import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'crm.records',
  title: "CRM record tools",
  description: "Reads or writes configured CRM integration records.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('crm.records', input);
}
