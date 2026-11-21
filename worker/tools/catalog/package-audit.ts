import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'package.audit',
  title: "Audit dependencies",
  description: "Runs package manager security audit.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('package.audit', input);
}
