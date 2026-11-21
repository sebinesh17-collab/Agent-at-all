import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'git.diff',
  title: "Git diff",
  description: "Reads current source changes.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('git.diff', input);
}
