import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.docker',
  title: "Docker CLI",
  description: "Runs Docker commands when Docker-in-Docker is enabled.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.docker', input);
}
