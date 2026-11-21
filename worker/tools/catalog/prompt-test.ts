import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'prompt.test',
  title: "Test system prompt",
  description: "Runs a prompt against a selected model.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('prompt.test', input);
}
