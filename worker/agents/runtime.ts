import type { Env, JobMessage } from '../types';
import { builtInAgents } from './catalog';
import { runOneAgent } from './runner';
import { selectProviderKeys } from '../providers/router';
import { providerById } from '../providers/registry';

export async function synthesizeRun(env:Env,job:JobMessage,outputs:any[]){
  const agent:any=builtInAgents.find(a=>a.id==='final-synthesizer');
  if(!agent)return null;
  const master=await env.DB.prepare("SELECT provider,model FROM agents WHERE id='master-leader-001'").first<any>();
  const providerId=master?.provider||agent.provider;
  const keys=await selectProviderKeys(env,providerId,5,'final-synthesizer');
  const provider:any=providerById.get(providerId);
  if(!provider||!keys.length)return {status:'blocked',reason:`No active ${providerId} provider key is available for final synthesis.`};
  const evidence=outputs.map(o=>({agentId:o.agentId,name:o.name,status:o.status,output:o.output,error:o.error,toolTrace:o.toolTrace}));
  const prompt=`You are the final synthesis specialist. Combine these independent agent outputs into one useful answer to the user's objective. Resolve contradictions explicitly, distinguish verified facts from assumptions, list incomplete work and next actions. Do not invent missing outputs.\n\nOBJECTIVE:\n${job.task}\n\nAGENT OUTPUTS:\n${JSON.stringify(evidence)}`;
  let lastError='';
  for(const key of keys){
    try{
      const result:any=await provider.generate({providerId:key.provider,endpoint:key.endpoint||provider.endpoint,apiKey:key.apiKey,model:master?.model||key.defaultModel||agent.model||'gpt-4.1-mini',systemPrompt:agent.systemPrompt,messages:[{role:'user',content:prompt}]});
      return {status:'completed',text:result.text,usage:result.usage};
    }catch(error){lastError=error instanceof Error?error.message:String(error);}
  }
  return {status:'failed',reason:lastError};
}

export async function executeRun(env:Env,job:JobMessage){
  const customRows=await env.DB.prepare('SELECT id,name,role,provider,model,system_prompt,enabled,allowed_tools,max_parallel_tasks FROM agents WHERE enabled=1').all<any>();
  const custom=customRows.results.map((a:any)=>({id:a.id,name:a.name,role:a.role,provider:a.provider,model:a.model,systemPrompt:a.system_prompt,job:a.role,allowedTools:JSON.parse(a.allowed_tools||'[]'),maxParallelTasks:a.max_parallel_tasks}));
  const selected=[...builtInAgents,...custom].filter(agent=>!job.agentIds||job.agentIds.includes(agent.id));
  const results=await Promise.allSettled(selected.map(agent=>runOneAgent(env,job,agent)));
  const outputs=results.map((result,index)=>result.status==='fulfilled'?result.value:{agentId:selected[index].id,name:selected[index].name,status:'failed',error:String(result.reason)});
  await Promise.all(outputs.map((output:any)=>env.DB.prepare('INSERT INTO agent_runs (id,run_id,agent_id,status,output_json,error_text,created_at,completed_at) VALUES (?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),job.runId,output.agentId,output.status,JSON.stringify(output.output??null),output.error??null,Date.now(),Date.now()).run()));
  const synthesis=await synthesizeRun(env,job,outputs);
  return {runId:job.runId,outputs,synthesis};
}
