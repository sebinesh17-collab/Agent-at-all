import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'code.write',
  title: "Write source code",
  description: "Writes source code to the workspace.",
  risk: 'medium',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('code.write', input);
}
