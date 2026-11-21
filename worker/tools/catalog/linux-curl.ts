import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.curl',
  title: "HTTP request",
  description: "Makes an HTTP request from the container when network is enabled.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.curl', input);
}
