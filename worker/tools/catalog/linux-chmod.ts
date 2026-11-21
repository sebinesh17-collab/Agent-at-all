import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.chmod',
  title: "Change file mode",
  description: "Changes permissions within workspace bounds.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.chmod', input);
}
