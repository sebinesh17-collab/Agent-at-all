import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'database.query',
  title: "Query database",
  description: "Executes parameterized SQL against the workspace D1 database.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('database.query', input);
}
