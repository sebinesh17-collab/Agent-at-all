import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'writing.grammar',
  title: "Grammar review",
  description: "Reviews grammar and clarity while preserving meaning.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('writing.grammar', input);
}
