import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'design.tokens',
  title: "Generate design tokens",
  description: "Creates a design token JSON artifact.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('design.tokens', input);
}
