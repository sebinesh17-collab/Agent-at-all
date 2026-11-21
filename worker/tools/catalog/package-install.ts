import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'package.install',
  title: "Install dependency",
  description: "Installs a project dependency in the Linux container.",
  risk: 'high',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('package.install', input);
}
