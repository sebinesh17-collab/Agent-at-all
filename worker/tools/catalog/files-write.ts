import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'files.write',
  title: "Write workspace file",
  description: "Writes text into the isolated workspace.",
  risk: 'medium',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('files.write', input);
}
