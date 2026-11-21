import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'linux.python',
  title: "Run Python",
  description: "Executes Python code in the isolated container.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('linux.python', input);
}
