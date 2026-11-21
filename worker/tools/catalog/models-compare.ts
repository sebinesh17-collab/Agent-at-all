import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'models.compare',
  title: "Compare AI models",
  description: "Compares model metadata supplied by the workspace owner.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('models.compare', input);
}
