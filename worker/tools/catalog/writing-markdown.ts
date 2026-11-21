import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'writing.markdown',
  title: "Format Markdown",
  description: "Formats supplied content as a Markdown artifact.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('writing.markdown', input);
}
