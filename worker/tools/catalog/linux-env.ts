import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.env',
  title: "Inspect environment",
  description: "Lists allowed non-secret environment metadata.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.env', input);
}
