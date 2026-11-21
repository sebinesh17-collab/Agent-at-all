import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.pip',
  title: "Run pip",
  description: "Installs or inspects Python dependencies.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.pip', input);
}
