import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.ssh',
  title: "SSH helper",
  description: "Runs SSH client commands when authorized keys are configured.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.ssh', input);
}
