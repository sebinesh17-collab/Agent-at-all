import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.apt',
  title: "Run apt",
  description: "Installs approved Debian packages in the container.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.apt', input);
}
