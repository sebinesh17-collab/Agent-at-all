import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'terminal.exec',
  title: "Execute Linux command",
  description: "Runs an argv command in the isolated Cloudflare Container workspace.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('terminal.exec', input);
}
