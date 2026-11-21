import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'provider.rotate',
  title: "Rotate provider key",
  description: "Rotates credentials using secure secret entry.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('provider.rotate', input);
}
