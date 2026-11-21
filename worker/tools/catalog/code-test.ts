import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'code.test',
  title: "Run project tests",
  description: "Runs configured project test command in the isolated Linux container.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('code.test', input);
}
