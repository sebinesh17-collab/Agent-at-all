import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.rsync',
  title: "Sync files",
  description: "Synchronizes project files within approved paths.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.rsync', input);
}
