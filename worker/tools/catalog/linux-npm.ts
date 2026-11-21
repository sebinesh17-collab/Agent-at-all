import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.npm',
  title: "Run npm",
  description: "Runs npm commands in the project workspace.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.npm', input);
}
