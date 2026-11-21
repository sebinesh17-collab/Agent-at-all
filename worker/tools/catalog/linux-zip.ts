import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.zip',
  title: "Zip files",
  description: "Creates or extracts ZIP archives.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.zip', input);
}
