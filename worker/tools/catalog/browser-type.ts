import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'browser.type',
  title: "Browser text input",
  description: "Types into a locator through configured browser service.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('browser.type', input);
}
