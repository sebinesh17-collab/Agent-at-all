import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'design.review',
  title: "Review UI source",
  description: "Checks UI source for basic accessibility and responsive patterns.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('design.review', input);
}
