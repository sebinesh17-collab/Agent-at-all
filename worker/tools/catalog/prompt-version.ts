import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'prompt.version',
  title: "Version prompt",
  description: "Stores a versioned system prompt.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('prompt.version', input);
}
