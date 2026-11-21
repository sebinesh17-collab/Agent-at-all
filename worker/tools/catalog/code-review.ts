import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'code.review',
  title: "Review source code",
  description: "Runs static heuristic review on source text.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('code.review', input);
}
