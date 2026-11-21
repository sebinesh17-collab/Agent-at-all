import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'browser.navigate',
  title: "Browser navigation",
  description: "Fetches and follows safe public web pages.",
  risk: 'low',
  requiresConfirmation: false,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('browser.navigate', input);
}
