import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'browser.screenshot',
  title: "Browser screenshot",
  description: "Captures a page screenshot through configured browser service.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('browser.screenshot', input);
}
