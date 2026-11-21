import type { ToolContext, ToolResult } from '../types';

export const definition = {
  id: 'cloudflare.deploy',
  title: "Cloudflare deployment helper",
  description: "Runs Wrangler deployment commands in the authorized project container.",
  risk: 'high',
  requiresConfirmation: true,
  inputSchema: { type: 'object', additionalProperties: true },
} as const;

export async function execute(context: ToolContext, input: Record<string, unknown>): Promise<ToolResult> {
  return context.services.invoke('cloudflare.deploy', input);
}
