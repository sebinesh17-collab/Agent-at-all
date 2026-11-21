import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'workflow.resume',
  title: "Resume workflow",
  description: "Resumes a paused workflow.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('workflow.resume', input);
}
