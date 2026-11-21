import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'prompt.rollback',
  title: "Rollback prompt",
  description: "Restores a previous prompt version.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('prompt.rollback', input);
}
