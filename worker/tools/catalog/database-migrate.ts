import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'database.migrate',
  title: "Apply database migration",
  description: "Applies a migration script after validation.",
  risk: 'medium',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('database.migrate', input);
}
