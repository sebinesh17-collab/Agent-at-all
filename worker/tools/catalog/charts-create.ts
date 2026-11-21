import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'charts.create',
  title: "Create chart specification",
  description: "Creates a JSON chart artifact for the UI.",
  risk: 'medium',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('charts.create', input);
}
