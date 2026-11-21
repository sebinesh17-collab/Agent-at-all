import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.tar',
  title: "Archive files",
  description: "Creates or extracts project archives.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.tar', input);
}
