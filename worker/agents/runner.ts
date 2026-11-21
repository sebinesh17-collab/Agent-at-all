import type { Env, JobMessage } from '../types';
import { selectProviderKeys, markKeyUsed, markKeyFailure } from '../providers/router';
import { toolDefinitions } from '../tools';
import { createServiceInvoker } from '../services/service-dispatch';
import { executeTool } from '../tools/executor';

export async function runOneAgent(env:Env,job:JobMessage,agent:any){
  const started=Date.now();
  const candidates=await selectProviderKeys(env,agent.provider||'openai',25,agent.id);
  if(!candidates.length)return {agentId:agent.id,name:agent.name,status:'blocked',error:`No active API key for ${agent.provider||'openai'}`};
  const {providerById}=await import('../providers/registry');
  const provider:any=providerById.get(agent.provider||'openai');
  if(!provider)throw new Error(`Unsupported provider ${agent.provider}`);
  const messages:any[]=[{role:'user',content:`PRIMARY OBJECTIVE:\n${job.task}\n\nYOUR ASSIGNED WORK PACKAGE:\n${agent.job||agent.role}\n\nWork only on your specialist responsibility. Return evidence, decisions, assumptions, risks, and concrete artifacts.`}];
  const inbox=await env.DB.prepare(`SELECT id,sender_agent_id,message_type,content_json,created_at FROM agent_messages
    WHERE run_id=? AND receiver_agent_id=? AND delivery_status='queued' ORDER BY created_at LIMIT 20`)
    .bind(job.runId,agent.id).all<any>();
  if(inbox.results.length){
    const inboxText=inbox.results.map((row:any)=>`From ${row.sender_agent_id} (${row.message_type}): ${JSON.parse(row.content_json||'{}').content||''}`).join('\n');
    const updates=inbox.results.map((row:any)=>env.DB.prepare("UPDATE agent_messages SET delivery_status='delivered',delivered_at=? WHERE id=? AND delivery_status='queued'").bind(Date.now(),row.id));
    await env.DB.batch(updates);
    messages[0].content+=`\n\nCOLLABORATION INBOX:\n${inboxText}`;
  }
  const allowed=(agent.allowedTools||[]).filter((id:string)=>toolDefinitions.some((tool:any)=>tool.id===id));
  const tools=allowed.map((id:string)=>{const definition:any=toolDefinitions.find((tool:any)=>tool.id===id);return {type:'function',function:{name:id.replaceAll('.','__'),description:definition.description,parameters:{type:'object',additionalProperties:true}}};});
  const services=createServiceInvoker(env,job.userId,job.runId,agent.id);
  const toolContext:any={userId:job.userId,runId:job.runId,agentId:agent.id,allowedTools:allowed,services};
  const trace:any[]=[];
  let finalText='';
  let toolCallCount=0;
  const maxToolCalls=Math.max(1,Math.min(20,Number(agent.executionLimits?.max_tool_calls)||8));
  const maxModelSteps=Math.max(1,Math.min(10,Number(agent.executionLimits?.max_model_steps)||5));
  let lastError='No provider key succeeded';
  for(const key of candidates){
    try{
      for(let step=0;step<maxModelSteps;step++){
        const result:any=await provider.generate({providerId:key.provider,endpoint:key.endpoint||provider.endpoint,apiKey:key.apiKey,model:agent.model||key.defaultModel||'gpt-4.1-mini',systemPrompt:agent.systemPrompt,messages,tools});
        finalText=String(result.text||'').slice(0,12000);
        const calls=result.toolCalls||[];
        if(!calls.length)break;
        messages.push({role:'assistant',content:finalText||null,tool_calls:calls});
        for(const call of calls){
          if(toolCallCount>=maxToolCalls){messages.push({role:'user',content:`Tool-call limit (${maxToolCalls}) reached. Finish with the evidence already collected.`});break;}
          toolCallCount++;
          const toolId=String(call.function?.name||'').replaceAll('__','.');
          let input:any={};try{input=JSON.parse(call.function?.arguments||'{}')}catch{}
          const output=await executeTool(toolContext,toolId,input);
          trace.push({toolId,ok:output.ok,error:output.error});
          messages.push({role:'tool',tool_call_id:call.id,content:JSON.stringify(output)});
        }
        if(toolCallCount>=maxToolCalls)break;
      }
      await markKeyUsed(env,key.id);
      return {agentId:agent.id,name:agent.name,status:'completed',output:finalText,toolTrace:trace,keyId:key.id,durationMs:Date.now()-started};
    }catch(error){
      lastError=error instanceof Error?error.message:String(error);
      await markKeyFailure(env,key.id,lastError);
      if(/401|403|invalid api key|authentication/i.test(lastError))continue;
      if(/429|rate.?limit|5\d\d|temporar/i.test(lastError))continue;
      throw error;
    }
  }
  return {agentId:agent.id,name:agent.name,status:'failed',error:lastError,durationMs:Date.now()-started};
}
