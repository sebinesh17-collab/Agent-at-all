import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'terminal.install',
  title: "Install packages",
  description: "Installs packages using npm, pnpm, pip, apt-get, or cargo in the container.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('terminal.install', input);
}
