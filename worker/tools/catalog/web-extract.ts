import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'web.extract',
  title: "Extract page text",
  description: "Extracts readable text from fetched HTML.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('web.extract', input);
}
