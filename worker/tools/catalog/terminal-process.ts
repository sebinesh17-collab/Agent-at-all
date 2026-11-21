import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'terminal.process',
  title: "Inspect processes",
  description: "Inspects process state in the isolated container.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('terminal.process', input);
}
