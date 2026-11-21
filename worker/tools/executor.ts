import { toolRegistry } from './registry';
import type { ToolContext, ToolResult } from './types';

export async function executeTool(context: ToolContext, toolId: string, input: Record<string, unknown>): Promise<ToolResult> {
  const tool = toolRegistry.get(toolId);
  if (!tool) return { ok: false, error: `Unknown tool: ${toolId}` };
  if (!Array.isArray((context as any).allowedTools) || !(context as any).allowedTools.includes(toolId)) {
    return { ok: false, error: `Tool ${toolId} is not allowed for agent ${context.agentId}` };
  }
  return tool.execute(context, input);
}
