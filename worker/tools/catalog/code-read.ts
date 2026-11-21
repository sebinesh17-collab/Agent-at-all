import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'code.read',
  title: "Read source code",
  description: "Reads source files from the workspace.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('code.read', input);
}
