import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'calendar.events',
  title: "Calendar events",
  description: "Create and list calendar events through configured calendar integration.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('calendar.events', input);
}
