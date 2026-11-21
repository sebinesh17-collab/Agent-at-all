import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'writing.document',
  title: "Create document",
  description: "Creates a Markdown document in workspace storage.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('writing.document', input);
}
