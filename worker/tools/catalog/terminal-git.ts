import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'terminal.git',
  title: "Git operations",
  description: "Runs git commands in the isolated project workspace.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('terminal.git', input);
}
