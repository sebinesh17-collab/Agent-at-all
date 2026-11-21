import type { ToolContext, ToolResult } from '../types';
export const definition={id: 'agent.inbox',title:'Read agent inbox',description:'Read structured messages delivered to the current agent during this run.',risk:'low',requiresConfirmation:false,inputSchema:{type:'object',properties:{limit:{type:'integer'}}}} as const;
export async function execute(context:ToolContext,input:Record<string,unknown>):Promise<ToolResult>{return context.services.invoke('agent.inbox',input);}
