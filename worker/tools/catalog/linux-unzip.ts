import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.unzip',
  title: "Unzip files",
  description: "Extracts ZIP files into workspace.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.unzip', input);
}
