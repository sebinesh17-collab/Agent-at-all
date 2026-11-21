import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'git.commit',
  title: "Git commit",
  description: "Creates a commit in the project workspace.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('git.commit', input);
}
