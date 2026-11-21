import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.wget',
  title: "Download file",
  description: "Downloads a file from an approved URL.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.wget', input);
}
