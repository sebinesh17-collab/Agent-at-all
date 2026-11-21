import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'reports.write',
  title: "Write run report",
  description: "Stores a report artifact in R2.",
  risk: 'medium',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('reports.write', input);
}
