import type { Env } from '../types';
import { runLinuxCommand, writeLinuxFile, readLinuxFile } from './cloud-linux';
import { sendCompletionEmail } from './email-service';
import { storeObject, readObject, deleteObject, listObjects } from './object-storage';
import { storeFirebaseObject, readFirebaseObject } from './firebase-storage';
import { toolDefinitions } from '../tools';
import { providerById } from '../providers/registry';

const safeKey=(userId:string,runId:string,path:string)=>`${userId}/runs/${runId}/${path.replace(/^\/+/, '').replace(/\.\.(?:\/|$)/g,'')}`;
const safeWorkspacePath=(path:string)=>{const normalized=path.replaceAll('\\','/').replace(/^\/+/, '');const parts=normalized.split('/');if(!normalized||normalized.includes('\0')||parts.some(part=>part==='..'||part===''))throw new Error('Invalid workspace file path');return parts.join('/')};
async function webSearch(env:Env,query:string){
  if(!env.WEB_SEARCH_API_KEY)throw new Error('Configure WEB_SEARCH_API_KEY for live web search.');
  const r=await fetch('https://google.serper.dev/search',{method:'POST',headers:{'X-API-KEY':env.WEB_SEARCH_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({q:query,num:8})});
  const data:any=await r.json();if(!r.ok)throw new Error(`Search provider returned ${r.status}`);
  return (data.organic||[]).map((x:any)=>({title:x.title,url:x.link,snippet:x.snippet}));
}
export function createServiceInvoker(env: Env, userId: string, runId: string, agentId: string) {
  return { invoke: async (toolId: string, input: Record<string, unknown>) => {
    const path=safeKey(userId,runId,String(input.path||input.key||'untitled.txt'));
    switch (toolId) {
      case 'web.search': return {ok:true,data:await webSearch(env,String(input.query||''))};
      case 'web.open': {
        const url=new URL(String(input.url||''));if(!['http:','https:'].includes(url.protocol))throw new Error('Only HTTP(S) URLs are supported.');
        const r=await fetch(url,{headers:{'User-Agent':'AETHER-Research-Bot/1.0'},signal:AbortSignal.timeout(15000)});
        return {ok:r.ok,data:{url:url.href,status:r.status,contentType:r.headers.get('content-type'),text:(await r.text()).slice(0,30000)}};
      }
      case 'code.write': { const content=String(input.content||input.text||'');const relative=safeWorkspacePath(String(input.path||'main.ts'));const now=Date.now();const lock=await env.DB.prepare(`INSERT INTO workspace_file_locks(user_id,run_id,file_path,agent_id,acquired_at,lease_until) VALUES(?,?,?,?,?,?) ON CONFLICT(user_id,run_id,file_path) DO UPDATE SET agent_id=excluded.agent_id,acquired_at=excluded.acquired_at,lease_until=excluded.lease_until WHERE workspace_file_locks.lease_until<? OR workspace_file_locks.agent_id=? RETURNING agent_id`).bind(userId,runId,relative,agentId,now,now+30*60*1000,now,agentId).first<any>();if(!lock)return {ok:false,error:`File ${relative} is owned by another agent for this run. Request a handoff from your Team Leader.`};return {ok:true,data:await writeLinuxFile(env,userId,relative,content,runId)}; }
      case 'files.write': case 'writing.document': case 'writing.markdown': {
        const content=String(input.content||input.text||'');const stored=await storeObject(env,path,content);
        return {ok:true,data:{bytes:new TextEncoder().encode(content).length,...stored}};
      }
      case 'code.read': return {ok:true,data:await readLinuxFile(env,userId,String(input.path||'main.ts'),runId)};
      case 'agent.create': {
        const manager=await env.DB.prepare('SELECT id,name,hierarchy_level,provider,model,department_code FROM agents WHERE id=?').bind(agentId).first<any>();
        if(!manager||manager.hierarchy_level==='worker')throw new Error('Only a manager-level agent can create specialist agents.');
        const name=String(input.name||'').trim();const category=String(input.category||'custom').trim();const role=String(input.job_title||input.role||'Specialist Worker').trim();
        const prompt=String(input.system_prompt||'').trim();if(!name||!prompt)throw new Error('Agent name and individual system_prompt are required.');
        const provider=String(input.provider||manager.provider||'openai');const model=String(input.model||manager.model||'gpt-4.1-mini');if(!providerById.has(provider))throw new Error(`Unsupported provider ${provider}.`);
        const requestedTools=Array.isArray(input.tools)?input.tools.map(String):[];const validTools=requestedTools.filter(id=>toolDefinitions.some((tool:any)=>tool.id===id));
        const skills=Array.isArray(input.skills)?input.skills.map(String).slice(0,50):[];
        const id=`custom-${crypto.randomUUID()}`;const now=Date.now();
        await env.DB.prepare(`INSERT INTO agents(id,name,role,provider,model,system_prompt,enabled,allowed_tools,max_parallel_tasks,
          hierarchy_level,category,job_title,manager_agent_id,skills,permissions,memory_enabled,status,execution_limits,resource_budget,is_seeded,department_code,agent_index,created_at,updated_at)
          VALUES(?,?,?,?,?,?,1,?,1,'worker',?,?,?,?,?,1,'idle','{"timeout_seconds":120,"max_tool_calls":8,"max_retries":2}','{"max_tokens_per_task":12000,"max_cost_usd_per_task":0.25}',0,?,NULL,?,?)`)
          .bind(id,name,role,provider,model,prompt,JSON.stringify(validTools),category,role,agentId,JSON.stringify(skills),JSON.stringify(['task.read','task.update','agent.message','agent.inbox']),manager.department_code,now,now).run();
        const run=await env.DB.prepare("SELECT status,task,user_id,agent_count FROM runs WHERE id=?").bind(runId).first<any>();
        if(run&&['planning','running','queued'].includes(run.status)){
          const max=await env.DB.prepare('SELECT COALESCE(MAX(ordinal),0) AS n FROM run_agent_assignments WHERE run_id=?').bind(runId).first<any>();
          const ordinal=Number(max?.n||0)+1;
          await env.DB.prepare("INSERT OR IGNORE INTO run_agent_assignments(id,run_id,agent_id,ordinal,status,created_at) VALUES(?,?,?,?,'pending',?)").bind(crypto.randomUUID(),runId,id,ordinal,now).run();
          await env.DB.prepare('UPDATE runs SET agent_count=agent_count+1,pending_tasks=pending_tasks+1 WHERE id=?').bind(runId).run();
          await env.TASK_QUEUE.send({kind:'fanout',runId,userId,task:String(run.task||''),callbackEmail:undefined,offset:ordinal});
        }
        return {ok:true,data:{agentId:id,name,managerAgentId:agentId,provider,model,tools:validTools,status:'created'}};
      }
      case 'agent.update': {
        const target=String(input.agent_id||'');if(!target)throw new Error('agent_id is required.');
        const [manager,targetRow]=await Promise.all([env.DB.prepare('SELECT hierarchy_level FROM agents WHERE id=?').bind(agentId).first<any>(),env.DB.prepare('SELECT id,is_seeded,manager_agent_id FROM agents WHERE id=?').bind(target).first<any>()]);
        if(!manager||!targetRow)throw new Error('Manager or target agent not found.');
        if(targetRow.is_seeded&&manager.hierarchy_level==='worker')throw new Error('Workers cannot modify seeded organization agents.');
        if(target!==agentId&&targetRow.manager_agent_id!==agentId&&manager.hierarchy_level!=='master')throw new Error('You can only update yourself or your direct reports.');
        if(input.provider&&!providerById.has(String(input.provider)))throw new Error(`Unsupported provider ${String(input.provider)}.`);
        const tools=Array.isArray(input.tools)?JSON.stringify([...new Set([...input.tools.map(String),'agent.message','agent.inbox'])].filter((id:string)=>toolDefinitions.some((tool:any)=>tool.id===id))):null;
        await env.DB.prepare(`UPDATE agents SET provider=COALESCE(?,provider),model=COALESCE(?,model),system_prompt=COALESCE(?,system_prompt),
          allowed_tools=COALESCE(?,allowed_tools),enabled=COALESCE(?,enabled),updated_at=? WHERE id=?`)
          .bind(input.provider||null,input.model||null,input.system_prompt||null,tools,input.enabled===undefined?null:(input.enabled?1:0),Date.now(),target).run();
        return {ok:true,data:{agentId:target,updated:true}};
      }
      case 'agent.delete': {
        const target=String(input.agent_id||'');const row=await env.DB.prepare('SELECT is_seeded,manager_agent_id,status FROM agents WHERE id=?').bind(target).first<any>();
        if(!row)throw new Error('Agent not found.');if(row.is_seeded)throw new Error('Seeded organization agents cannot be deleted.');
        if(row.manager_agent_id!==agentId)throw new Error('You can only delete your direct reports.');if(row.status==='running')throw new Error('Pause or stop the agent before deleting it.');const assigned=await env.DB.prepare("SELECT status FROM run_agent_assignments WHERE run_id=? AND agent_id=? AND status IN ('pending','running')").bind(runId,target).first<any>();if(assigned)throw new Error('This agent still has work in the current run.');
        await env.DB.prepare('DELETE FROM agents WHERE id=?').bind(target).run();return {ok:true,data:{agentId:target,deleted:true}};
      }
      case 'agents.status': {
        const rows=await env.DB.prepare(`SELECT id,name,hierarchy_level,category,status,current_task,last_active_at FROM agents
          WHERE id=? OR manager_agent_id=? ORDER BY hierarchy_level,agent_index LIMIT 200`).bind(agentId,agentId).all<any>();
        return {ok:true,data:rows.results};
      }
      case 'agents.dispatch': {
        const receiver=String(input.agent_id||'');const task=String(input.task||'');if(!receiver||!task.trim())throw new Error('agent_id and task are required.');
        const target=await env.DB.prepare('SELECT manager_agent_id FROM agents WHERE id=?').bind(receiver).first<any>();
        if(!target||target.manager_agent_id!==agentId)throw new Error('You can only dispatch tasks to your direct reports.');
        const id=crypto.randomUUID();await env.DB.prepare(`INSERT INTO agent_messages(id,project_id,run_id,sender_agent_id,receiver_agent_id,message_type,priority,content_json,delivery_status,created_at) VALUES(?,?,?,?,?,'task_assignment','high',?,'queued',?)`)
          .bind(id,runId,runId,agentId,receiver,JSON.stringify({content:task.slice(0,8000)}),Date.now()).run();
        return {ok:true,data:{messageId:id,agentId:receiver,queued:true}};
      }
      case 'task.create': {
        const description=String(input.description||input.task||'').trim();if(!description||description.length>8000)throw new Error('A task description (up to 8,000 characters) is required.');
        const assignedAgent=String(input.agent_id||agentId);const target=await env.DB.prepare('SELECT id,manager_agent_id FROM agents WHERE id=?').bind(assignedAgent).first<any>();
        if(!target)throw new Error('Assigned agent not found.');if(assignedAgent!==agentId&&target.manager_agent_id!==agentId)throw new Error('Tasks can only be assigned to yourself or your direct reports.');
        const roster=await env.DB.prepare('SELECT status FROM run_agent_assignments WHERE run_id=? AND agent_id=?').bind(runId,assignedAgent).first<any>();
        if(!roster)throw new Error('Assigned agent is not part of this run.');
        const id=crypto.randomUUID();const dependencies=Array.isArray(input.dependencies)?input.dependencies.map(String).slice(0,30):[];const now=Date.now();
        await env.DB.prepare(`INSERT INTO agent_tasks(id,project_id,run_id,agent_id,manager_agent_id,priority,description,dependencies_json,status,created_at)
          VALUES(?,?,?,?,?,?,?,?, 'pending',?)`).bind(id,runId,runId,assignedAgent,agentId,String(input.priority||'normal'),description,JSON.stringify(dependencies),now).run();
        for(const dependency of dependencies){await env.DB.prepare('INSERT OR IGNORE INTO task_dependencies(task_id,depends_on_task_id) VALUES(?,?)').bind(id,dependency).run();}
        if(assignedAgent!==agentId){const messageId=crypto.randomUUID();await env.DB.prepare(`INSERT INTO agent_messages(id,project_id,run_id,sender_agent_id,receiver_agent_id,message_type,priority,content_json,delivery_status,created_at) VALUES(?,?,?,?,?,'task_assignment','high',?,'queued',?)`).bind(messageId,runId,runId,agentId,assignedAgent,JSON.stringify({taskId:id,content:description}),now).run();}
        return {ok:true,data:{taskId:id,agentId:assignedAgent,status:'pending',dependencies}};
      }
      case 'task.assign': {
        const taskId=String(input.task_id||'');const assignedAgent=String(input.agent_id||'');if(!taskId||!assignedAgent)throw new Error('task_id and agent_id are required.');
        const [taskRow,target,roster]=await Promise.all([env.DB.prepare('SELECT id,description FROM agent_tasks WHERE id=? AND run_id=?').bind(taskId,runId).first<any>(),env.DB.prepare('SELECT id,manager_agent_id FROM agents WHERE id=?').bind(assignedAgent).first<any>(),env.DB.prepare('SELECT status FROM run_agent_assignments WHERE run_id=? AND agent_id=?').bind(runId,assignedAgent).first<any>()]);
        if(!taskRow||!target||target.manager_agent_id!==agentId||!roster)throw new Error('Task or direct-report target is invalid or not in this run.');
        await env.DB.prepare("UPDATE agent_tasks SET agent_id=?,manager_agent_id=?,status='pending',started_at=NULL,completed_at=NULL WHERE id=?").bind(assignedAgent,agentId,taskId).run();
        const messageId=crypto.randomUUID();await env.DB.prepare(`INSERT INTO agent_messages(id,project_id,run_id,sender_agent_id,receiver_agent_id,message_type,priority,content_json,delivery_status,created_at) VALUES(?,?,?,?,?,'task_assignment','high',?,'queued',?)`).bind(messageId,runId,runId,agentId,assignedAgent,JSON.stringify({taskId,content:taskRow.description}),Date.now()).run();
        return {ok:true,data:{taskId,agentId:assignedAgent,assigned:true}};
      }
      case 'task.complete': case 'task.block': {
        const taskId=String(input.task_id||'');if(!taskId)throw new Error('task_id is required.');
        const row=await env.DB.prepare('SELECT agent_id,manager_agent_id FROM agent_tasks WHERE id=? AND run_id=?').bind(taskId,runId).first<any>();
        if(!row||(row.agent_id!==agentId&&row.manager_agent_id!==agentId))throw new Error('Task is missing or you are not authorized to update it.');
        const status=toolId==='task.complete'?'completed':'blocked';const output=String(input.output||input.result||'').slice(0,12000);const error=String(input.reason||input.error||'').slice(0,4000);
        await env.DB.prepare('UPDATE agent_tasks SET status=?,output_json=?,error_text=?,completed_at=? WHERE id=? AND run_id=?').bind(status,JSON.stringify({output}),error||null,Date.now(),taskId,runId).run();
        return {ok:true,data:{taskId,status}};
      }
      case 'task.decompose': {
        const subtasks=Array.isArray(input.subtasks)?input.subtasks.slice(0,25):[];if(!subtasks.length)throw new Error('Provide a subtasks array.');
        const created=[];for(const item of subtasks){const description=String((item as any).description||(item as any).task||'').trim();if(!description)continue;const id=crypto.randomUUID();await env.DB.prepare(`INSERT INTO agent_tasks(id,project_id,run_id,agent_id,manager_agent_id,priority,description,status,created_at) VALUES(?,?,?,?,?,? ,?,'pending',?)`).bind(id,runId,runId,agentId,agentId,String((item as any).priority||'normal'),description.slice(0,8000),Date.now()).run();created.push({taskId:id,description});}return {ok:true,data:{created}};
      }
      case 'task.validate': {
        const taskId=String(input.task_id||'');const row=await env.DB.prepare('SELECT id,agent_id,description,status,output_json,error_text,completed_at FROM agent_tasks WHERE id=? AND run_id=?').bind(taskId,runId).first<any>();
        return row?{ok:true,data:{...row,output:row.output_json?JSON.parse(row.output_json):null}}:{ok:false,error:'Task not found.'};
      }
      case 'agent.message': {
        const receiver=String(input.receiver_agent_id||'');const content=String(input.content||'');if(!receiver||!content.trim()||content.length>8000)throw new Error('receiver_agent_id and content (up to 8,000 characters) are required.');
        const [senderRow,receiverRow,assignment]=await Promise.all([
          env.DB.prepare('SELECT id,manager_agent_id,department_code FROM agents WHERE id=?').bind(agentId).first<any>(),
          env.DB.prepare('SELECT id,manager_agent_id,department_code FROM agents WHERE id=?').bind(receiver).first<any>(),
          env.DB.prepare('SELECT status FROM run_agent_assignments WHERE run_id=? AND agent_id=?').bind(runId,receiver).first<any>()
        ]);
        if(!senderRow||!receiverRow||!assignment)throw new Error('Recipient must be an agent assigned to the same run.');
        const allowed=senderRow.id===receiverRow.manager_agent_id||senderRow.manager_agent_id===receiverRow.id||senderRow.manager_agent_id===receiverRow.manager_agent_id||senderRow.department_code===receiverRow.department_code;
        if(!allowed)throw new Error('Agent communication is restricted to your manager, direct reports, team peers, and same-department agents.');
        const id=crypto.randomUUID();await env.DB.prepare(`INSERT INTO agent_messages(id,project_id,run_id,sender_agent_id,receiver_agent_id,message_type,priority,content_json,delivery_status,created_at) VALUES(?,?,?,?,?,?,?,?, 'queued',?)`).bind(id,runId,runId,agentId,receiver,String(input.message_type||'collaboration').slice(0,80),String(input.priority||'normal').slice(0,20),JSON.stringify({content}),Date.now()).run();
        return {ok:true,data:{messageId:id,receiverAgentId:receiver,deliveryStatus:'queued'}};
      }
      case 'agent.inbox': {
        const limit=Math.min(20,Math.max(1,Number(input.limit)||10));const rows=await env.DB.prepare(`SELECT id,sender_agent_id,message_type,priority,content_json,created_at FROM agent_messages WHERE run_id=? AND receiver_agent_id=? AND delivery_status IN ('queued','delivered') ORDER BY created_at DESC LIMIT ?`).bind(runId,agentId,limit).all<any>();
        if(rows.results.length){const statements=rows.results.map((row:any)=>env.DB.prepare("UPDATE agent_messages SET delivery_status='read',delivered_at=? WHERE id=? AND delivery_status IN ('queued','delivered')").bind(Date.now(),row.id));await env.DB.batch(statements);}
        return {ok:true,data:rows.results.map((row:any)=>({...row,content:JSON.parse(row.content_json||'{}').content||''}))};
      }
      case 'files.read': case 'writing.summarize': {
        const item=await readObject(env,path);if(!item)return {ok:false,error:'File not found'};return {ok:true,data:item};
      }
      case 'files.list': {
        const prefix=`${userId}/runs/${runId}/${String(input.prefix||'')}`;const listed=await listObjects(env,prefix);
        return {ok:true,data:listed};
      }
      case 'files.delete': case 'storage.delete': {
        await deleteObject(env,path);return {ok:true,data:{key:path,deleted:true}};
      }
      case 'writing.rewrite': case 'writing.grammar': {
        const text=String(input.text||input.content||'');return {ok:true,data:{text,instructions:String(input.instructions||'Preserve meaning and improve clarity.')}};
      }
      case 'data.analyze': {
        const rows=Array.isArray(input.rows)?input.rows:[];return {ok:true,data:{rowCount:rows.length,keys:[...new Set(rows.flatMap((r:any)=>Object.keys(r||{})))],sample:rows.slice(0,5)}};
      }
      case 'terminal.exec': case 'terminal.files': case 'terminal.install': case 'terminal.git': case 'terminal.process':
      case 'linux.pwd': case 'linux.ls': case 'linux.mkdir': case 'linux.cat': case 'linux.cp': case 'linux.mv':
      case 'linux.tar': case 'linux.zip': case 'linux.unzip': case 'linux.find': case 'linux.grep': case 'linux.head': case 'linux.tail':
      case 'linux.df': case 'linux.du': case 'linux.ps': case 'linux.curl': case 'linux.wget': case 'linux.make': case 'linux.npm':
      case 'linux.pip': case 'linux.apt': case 'linux.node': case 'linux.python': case 'linux.node.version': case 'linux.python.version':
      case 'package.install': case 'package.audit': case 'package.list': case 'code.test': {
        const aliases:any={
          'linux.node.version':['node',['--version']], 'linux.python.version':['python3',['--version']],
          'linux.apt':['apt-get',Array.isArray(input.args)?input.args:['update']],
          'linux.node':['node',Array.isArray(input.args)?input.args:[]], 'linux.python':['python3',Array.isArray(input.args)?input.args:[]],
          'linux.npm':['npm',Array.isArray(input.args)?input.args:[]], 'linux.pip':['pip',Array.isArray(input.args)?input.args:[]],
          'package.install':['npm',['install',String(input.packageName||'')].filter(Boolean)],
          'package.audit':['npm',['audit']], 'package.list':['npm',['list']], 'code.test':['npm',['test']]
        };
        const [command,args]=aliases[toolId]||[String(input.command||toolId.replace(/^linux\./,'')),Array.isArray(input.args)?input.args.map(String):[]];
        return {ok:true,data:await runLinuxCommand(env,userId,{command,args},runId)};
      }
      case 'email.send': return {ok:true,data:await sendCompletionEmail(env,String(input.to||''),String(input.subject||'AETHER update'),String(input.text||''))};
      case 'storage.upload': return {ok:true,data:await storeObject(env,path,String(input.content||''))};
      case 'storage.download': return {ok:true,data:await readObject(env,path)};
      case 'firebase.upload': return {ok:true,data:await storeFirebaseObject(env,path,String(input.content||''))};
      case 'firebase.download': return {ok:true,data:await readFirebaseObject(env,path)};
      default: return {ok:false,error:`Tool ${toolId} is registered, but its external integration is not enabled in this deployment. Configure its connector before use.`};
    }
  }};
}
