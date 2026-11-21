import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'git.branch',
  title: "Git branch",
  description: "Creates or switches a project branch.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('git.branch', input);
}
