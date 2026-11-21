import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'web.open',
  title: "Open URL",
  description: "Fetches a public HTTP or HTTPS page with timeout and content limits.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('web.open', input);
}
