import { DurableObject } from 'cloudflare:workers';
import type { Env, JobMessage } from './types';
import { encryptSecret } from './crypto';
import { signToken, verifyToken, bearer } from './auth';
import { dispatchRun } from './agents/dispatcher';
import { toolDefinitions } from './tools';
import { consumeQueue } from './queue-consumer';
import { LinuxRunner } from './linux-runner';
import { AgentTaskWorkflow } from './agent-workflow';
import { createProjectArchive } from './services/project-archive';

const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Allow-Methods':'GET, POST, PUT, DELETE, OPTIONS'}});
const uid=()=>crypto.randomUUID();
async function body<T>(request:Request):Promise<T>{return await request.json() as T;}
export class AgentCoordinator extends DurableObject<Env> { async fetch(request:Request){const key=new URL(request.url).pathname;if(key==='/status')return json(Object.fromEntries(await this.ctx.storage.list()));if(request.method==='POST'){const data=await request.json();await this.ctx.storage.put(uid(),data);return json({accepted:true});}return json({service:'AETHER coordinator',status:'online'});} }
export { LinuxRunner, AgentTaskWorkflow };
export default {
 async fetch(request:Request,env:Env):Promise<Response>{
  if(request.method==='OPTIONS')return json({});
  const url=new URL(request.url);
  if(!url.pathname.startsWith('/api/'))return env.ASSETS.fetch(request);
  try{
   if(url.pathname==='/api/health'){const org=await env.DB.prepare('SELECT COUNT(*) AS total FROM agents').first<any>();return json({ok:true,app:'AETHER',agents:Number(org?.total||0),targetAgents:16111,tools:toolDefinitions.length,execution:'Cloudflare Workflows + Queues'});}
   if(url.pathname==='/api/auth/setup'&&request.method==='POST'){
    const {email,password}=await body<any>(request);if(!email||!password||password.length<12)return json({error:'Email and password (12+ characters) are required'},400);
    const count=await env.DB.prepare('SELECT COUNT(*) AS count FROM users').first<any>('count');if((count?.count??0)>0)return json({error:'Owner already configured'},409);
    const salt=crypto.getRandomValues(new Uint8Array(16));const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:210000,hash:'SHA-256'},key,256);
    await env.DB.prepare('INSERT INTO users (id,email,password_hash) VALUES (?,?,?)').bind(uid(),email.toLowerCase(),btoa(String.fromCharCode(...salt))+'.'+btoa(String.fromCharCode(...new Uint8Array(bits)))).run();return json({created:true});
   }
   if(url.pathname==='/api/auth/login'&&request.method==='POST'){
    const {email,password}=await body<any>(request);const user=await env.DB.prepare('SELECT * FROM users WHERE email=?').bind(String(email||'').toLowerCase()).first<any>();if(!user)return json({error:'Invalid credentials'},401);
    const [saltText,expected]=user.password_hash.split('.');const salt=Uint8Array.from(atob(saltText),c=>c.charCodeAt(0));const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:210000,hash:'SHA-256'},key,256);if(btoa(String.fromCharCode(...new Uint8Array(bits)))!==expected)return json({error:'Invalid credentials'},401);
    return json({token:await signToken({sub:user.id,email:user.email,role:user.role},env.AUTH_SECRET)});
   }
   const publicDownload=url.pathname.match(/^\/api\/download\/([a-f0-9-]{72})$/i);
   if(publicDownload&&request.method==='GET'){
    const token=publicDownload[1];const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));const tokenHash=[...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
    const row=await env.DB.prepare('SELECT object_key,expires_at,max_downloads,downloads FROM download_tokens WHERE token_hash=?').bind(tokenHash).first<any>();
    if(!row||Number(row.expires_at)<=Date.now()||Number(row.downloads)>=Number(row.max_downloads))return json({error:'Download link is invalid, expired, or has reached its download limit.'},404);
    const updated=await env.DB.prepare('UPDATE download_tokens SET downloads=downloads+1 WHERE token_hash=? AND downloads<max_downloads AND expires_at>?').bind(tokenHash,Date.now()).run();
    if(Number(updated.meta?.changes||0)===0)return json({error:'Download link has expired or reached its limit.'},404);
    const object=await env.ARTIFACTS.get(row.object_key);if(!object)return json({error:'Project archive not found.'},404);
    return new Response(object.body,{headers:{'Content-Type':'application/zip','Content-Disposition':'attachment; filename="aether-project.zip"','Cache-Control':'private, no-store'}});
   }
   const auth=await verifyToken(bearer(request),env);if(!auth)return json({error:'Authentication required'},401);
   if(url.pathname==='/api/dashboard'){
    const [keys,runs,recent,agentStats,levelStats]=await Promise.all([
      env.DB.prepare("SELECT COUNT(*) AS n FROM api_keys WHERE status='active'").first<any>(),
      env.DB.prepare('SELECT COUNT(*) AS n FROM runs WHERE user_id=?').bind(auth.sub).first<any>(),
      env.DB.prepare('SELECT id,task,status,agent_count,completed_tasks,failed_tasks,pending_tasks,running_tasks,created_at FROM runs WHERE user_id=? ORDER BY created_at DESC LIMIT 8').bind(auth.sub).all(),
      env.DB.prepare(`SELECT COUNT(*) AS total,SUM(CASE WHEN enabled=1 THEN 1 ELSE 0 END) AS enabled,
        SUM(CASE WHEN status='running' THEN 1 ELSE 0 END) AS running,
        SUM(CASE WHEN status='failed' THEN 1 ELSE 0 END) AS failed,
        SUM(CASE WHEN hierarchy_level='worker' THEN 1 ELSE 0 END) AS workers,
        SUM(CASE WHEN is_seeded=1 THEN 1 ELSE 0 END) AS organization FROM agents`).first<any>(),
      env.DB.prepare('SELECT hierarchy_level,COUNT(*) AS total FROM agents WHERE is_seeded=1 GROUP BY hierarchy_level').all<any>()
    ]);
    return json({activeKeys:keys?.n||0,totalRuns:runs?.n||0,recent:recent.results,totalAgents:Number(agentStats?.total||0),activeAgents:Number(agentStats?.enabled||0),runningAgents:Number(agentStats?.running||0),failedAgents:Number(agentStats?.failed||0),workerAgents:Number(agentStats?.workers||0),organizationAgents:Number(agentStats?.organization||0),hierarchy:levelStats.results});
   }
   if(url.pathname==='/api/organization/model-default'&&request.method==='POST'){
    const {provider,model}=await body<any>(request);
    if(typeof provider!=='string'||typeof model!=='string'||!provider.trim()||!model.trim())return json({error:'provider and model are required'},400);
    const known=(await import('./providers/registry')).providers.some(p=>p.id===provider);
    if(!known)return json({error:'Unsupported provider id'},400);
    const key=await env.DB.prepare("SELECT COUNT(*) AS n FROM api_keys WHERE provider=? AND status='active'").bind(provider).first<any>();
    if(!Number(key?.n||0))return json({error:`Add an active ${provider} API key before assigning this model.`},400);
    await env.DB.prepare('UPDATE agents SET provider=?,model=?,updated_at=? WHERE is_seeded=1').bind(provider,model.trim(),Date.now()).run();
    return json({updated:true,provider,model});
   }
   if(url.pathname==='/api/organization'&&request.method==='GET'){
    const [levels,statuses,seed]=await Promise.all([
      env.DB.prepare('SELECT hierarchy_level,COUNT(*) AS total FROM agents WHERE is_seeded=1 GROUP BY hierarchy_level').all<any>(),
      env.DB.prepare('SELECT status,COUNT(*) AS total FROM agents GROUP BY status').all<any>(),
      env.DB.prepare('SELECT target_count,seeded_count,completed_at FROM organization_seed_state WHERE id=1').first<any>()
    ]);
    return json({target:16111,seed,levels:levels.results,statuses:statuses.results});
   }
   if(url.pathname==='/api/agents'&&request.method==='GET'){
    const limit=Math.min(100,Math.max(1,Number(url.searchParams.get('limit'))||50));
    const offset=Math.max(0,Number(url.searchParams.get('offset'))||0);
    const search=(url.searchParams.get('search')||'').trim().slice(0,100);
    const level=url.searchParams.get('level');
    const category=url.searchParams.get('category');
    const clauses:string[]=[];const values:any[]=[];
    if(search){clauses.push('(name LIKE ? OR role LIKE ? OR category LIKE ? OR job_title LIKE ?)');values.push(`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`);}
    if(level){clauses.push('hierarchy_level=?');values.push(level);}
    if(category){clauses.push('category=?');values.push(category);}
    const where=clauses.length?`WHERE ${clauses.join(' AND ')}`:'';
    const [count,rows]=await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) AS total FROM agents ${where}`).bind(...values).first<any>(),
      env.DB.prepare(`SELECT id,name,role,provider,model,system_prompt,enabled,allowed_tools,max_parallel_tasks,hierarchy_level,category,job_title,manager_agent_id,skills,permissions,status,agent_index,is_seeded FROM agents ${where} ORDER BY CASE hierarchy_level WHEN 'master' THEN 0 WHEN 'principal' THEN 1 WHEN 'hod' THEN 2 WHEN 'team_leader' THEN 3 ELSE 4 END,agent_index,name LIMIT ? OFFSET ?`).bind(...values,limit,offset).all<any>()
    ]);
    return json({items:rows.results.map((a:any)=>({...a,allowedTools:JSON.parse(a.allowed_tools||'[]'),skills:JSON.parse(a.skills||'[]'),permissions:JSON.parse(a.permissions||'[]'),enabled:Boolean(a.enabled),builtIn:Boolean(a.is_seeded)})),total:Number(count?.total||0),offset,limit});
   }
   if(url.pathname==='/api/agents'&&request.method==='POST'){
    const a=await body<any>(request);if(!a.name||!a.provider||!a.model||!a.system_prompt)return json({error:'name, provider, model and system_prompt are required'},400);
    const id=uid();const allowed=Array.isArray(a.allowedTools)?a.allowedTools:['web.search','web.open','files.read','files.write','writing.document','code.read','code.write','terminal.exec'];
    await env.DB.prepare('INSERT INTO agents (id,name,role,provider,model,system_prompt,enabled,allowed_tools,max_parallel_tasks) VALUES (?,?,?,?,?,?,1,?,?)').bind(id,a.name,a.role||'Specialist',a.provider,a.model,a.system_prompt,JSON.stringify(allowed),Math.min(8,Math.max(1,Number(a.maxParallelTasks)||2))).run();
    return json({id,created:true},201);
   }
   const agentMatch=url.pathname.match(/^\/api\/agents\/([^/]+)$/);
   if(agentMatch&&request.method==='DELETE'){
    const existing=await env.DB.prepare('SELECT is_seeded FROM agents WHERE id=?').bind(agentMatch[1]).first<any>();
    if(!existing)return json({error:'Agent not found'},404);
    if(existing.is_seeded)return json({error:'Core organization agents cannot be deleted. Pause the agent instead.'},403);
    await env.DB.prepare('DELETE FROM agents WHERE id=?').bind(agentMatch[1]).run();return json({deleted:true});
   }
   if(agentMatch&&request.method==='PUT'){
    const data=await body<any>(request);
    const existing=await env.DB.prepare('SELECT id FROM agents WHERE id=?').bind(agentMatch[1]).first<any>();
    if(!existing)return json({error:'Agent not found'},404);
    await env.DB.prepare(`UPDATE agents SET
      enabled=COALESCE(?,enabled),provider=COALESCE(?,provider),model=COALESCE(?,model),
      system_prompt=COALESCE(?,system_prompt),allowed_tools=COALESCE(?,allowed_tools),
      updated_at=? WHERE id=?`)
      .bind(data.enabled===undefined?null:(data.enabled?1:0),data.provider||null,data.model||null,data.system_prompt||null,
        Array.isArray(data.allowedTools)?JSON.stringify(data.allowedTools):Array.isArray(data.tools)?JSON.stringify(data.tools):null,Date.now(),agentMatch[1]).run();
    return json({updated:true});
   }
   if(url.pathname==='/api/tools')return json(toolDefinitions);
   if(url.pathname==='/api/providers')return json((await import('./providers/registry')).providers.map(p=>({id:p.id,name:p.name,protocol:p.protocol})));
   if(url.pathname==='/api/keys'&&request.method==='POST'){
    const {provider,label,apiKey,priority=100,endpoint,defaultModel}=await body<any>(request);if(!provider||!label||!apiKey)return json({error:'provider,label,apiKey required'},400);
    const existingKeys=await env.DB.prepare('SELECT COUNT(*) AS n FROM api_keys WHERE provider=?').bind(provider).first<any>();if(Number(existingKeys?.n||0)>=1000)return json({error:'A provider can store at most 1,000 API keys in this workspace.'},409);
    const encrypted=await encryptSecret(apiKey,env.ENCRYPTION_KEY);const id=uid();await env.DB.prepare('INSERT INTO api_keys (id,provider,label,encrypted_value,iv,priority,endpoint,default_model) VALUES (?,?,?,?,?,?,?,?)').bind(id,provider,label,encrypted.ciphertext,encrypted.iv,priority,endpoint||null,defaultModel||null).run();return json({id,created:true},201);
   }
   const keyMatch=url.pathname.match(/^\/api\/keys\/([^/]+)$/);
   if(keyMatch&&request.method==='DELETE'){await env.DB.prepare('DELETE FROM api_keys WHERE id=?').bind(keyMatch[1]).run();return json({deleted:true});}
   if(url.pathname==='/api/keys'&&request.method==='GET'){const rows=await env.DB.prepare('SELECT id,provider,label,status,priority,last_used_at,created_at,endpoint,default_model FROM api_keys ORDER BY provider,priority').all();return json(rows.results);}
   if(url.pathname==='/api/runs'&&request.method==='GET'){
    const limit=Math.min(100,Math.max(1,Number(url.searchParams.get('limit'))||50));const offset=Math.max(0,Number(url.searchParams.get('offset'))||0);
    const rows=await env.DB.prepare(`SELECT id,task,status,agent_count,completed_tasks,failed_tasks,pending_tasks,running_tasks,fanout_complete,created_at,started_at,completed_at,archive_status,artifact_size,email_status
      FROM runs WHERE user_id=? ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(auth.sub,limit,offset).all<any>();
    return json(rows.results.map((row:any)=>({...row,progress:row.agent_count?Math.round((Number(row.completed_tasks||0)+Number(row.failed_tasks||0))/row.agent_count*100):0})));
   }
   if(url.pathname==='/api/runs'&&request.method==='POST'){
    const {task,agentIds,callbackEmail}=await body<any>(request);
    if(typeof task!=='string'||!task.trim())return json({error:'Task is required'},400);
    if(task.length>20000)return json({error:'Task is too large (20,000 characters maximum).'},413);
    const keyCount=await env.DB.prepare("SELECT COUNT(*) AS n FROM api_keys WHERE status='active'").first<any>();
    if(!Number(keyCount?.n||0))return json({error:'Add at least one active AI provider API key in API Vault before starting an autonomous run.'},400);
    const master=await env.DB.prepare("SELECT provider,enabled FROM agents WHERE id='master-leader-001'").first<any>();
    if(!master?.enabled)return json({error:'Enable the Master Leader before starting a run.'},400);
    const masterKey=await env.DB.prepare("SELECT COUNT(*) AS n FROM api_keys WHERE provider=? AND status='active'").bind(master.provider).first<any>();
    if(!Number(masterKey?.n||0))return json({error:`No active API key is configured for the Master Leader provider (${master.provider}). Set an organization-wide provider/model in Settings or add a matching key.`},400);
    const job:JobMessage={runId:'',userId:auth.sub,task:task.trim(),agentIds:Array.isArray(agentIds)?agentIds:undefined,callbackEmail};
    const result=await dispatchRun(env,job);return json(result,202);
   }
   const runAgentsMatch=url.pathname.match(/^\/api\/runs\/([0-9a-f-]{36})\/agents$/i);
   if(runAgentsMatch&&request.method==='GET'){
    const owner=await env.DB.prepare('SELECT id FROM runs WHERE id=? AND user_id=?').bind(runAgentsMatch[1],auth.sub).first<any>();
    if(!owner)return json({error:'Run not found'},404);
    const limit=Math.min(100,Math.max(1,Number(url.searchParams.get('limit'))||50));
    const offset=Math.max(0,Number(url.searchParams.get('offset'))||0);
    const rows=await env.DB.prepare(`SELECT ar.agent_id,a.name,a.hierarchy_level,a.category,ar.status,ar.output_json,ar.error_text,ar.created_at,ar.completed_at
      FROM agent_runs ar LEFT JOIN agents a ON a.id=ar.agent_id WHERE ar.run_id=? ORDER BY ar.created_at DESC LIMIT ? OFFSET ?`)
      .bind(runAgentsMatch[1],limit,offset).all<any>();
    return json(rows.results.map((r:any)=>({...r,output:r.output_json?JSON.parse(r.output_json):null})));
   }
   const runPackageMatch=url.pathname.match(/^\/api\/runs\/([0-9a-f-]{36})\/package$/i);
   if(runPackageMatch&&request.method==='POST'){
    const owner=await env.DB.prepare('SELECT id,status FROM runs WHERE id=? AND user_id=?').bind(runPackageMatch[1],auth.sub).first<any>();
    if(!owner)return json({error:'Run not found'},404);if(!['completed','completed_with_errors'].includes(owner.status))return json({error:'Wait until agent execution has finished before packaging.'},409);
    const archive=await createProjectArchive(env,auth.sub,runPackageMatch[1]);
    await env.DB.prepare("UPDATE runs SET artifact_key=?,artifact_size=?,archive_status='ready' WHERE id=?").bind(archive.key,archive.size,runPackageMatch[1]).run();
    return json({packaged:true,...archive});
   }
   const runDownloadMatch=url.pathname.match(/^\/api\/runs\/([0-9a-f-]{36})\/download$/i);
   if(runDownloadMatch&&request.method==='GET'){
    const owner=await env.DB.prepare('SELECT artifact_key FROM runs WHERE id=? AND user_id=?').bind(runDownloadMatch[1],auth.sub).first<any>();
    if(!owner?.artifact_key)return json({error:'Project archive is not ready.'},404);
    const object=await env.ARTIFACTS.get(owner.artifact_key);if(!object)return json({error:'Project archive not found.'},404);
    return new Response(object.body,{headers:{'Content-Type':'application/zip','Content-Disposition':'attachment; filename="aether-project.zip"','Cache-Control':'private, no-store'}});
   }
   const runTasksMatch=url.pathname.match(/^\/api\/runs\/([0-9a-f-]{36})\/tasks$/i);
   if(runTasksMatch&&request.method==='GET'){
    const owner=await env.DB.prepare('SELECT id FROM runs WHERE id=? AND user_id=?').bind(runTasksMatch[1],auth.sub).first<any>();
    if(!owner)return json({error:'Run not found'},404);
    const limit=Math.min(100,Math.max(1,Number(url.searchParams.get('limit'))||50));
    const offset=Math.max(0,Number(url.searchParams.get('offset'))||0);
    const rows=await env.DB.prepare(`SELECT id,agent_id,manager_agent_id,priority,description,status,created_at,started_at,completed_at,output_json,error_text
      FROM agent_tasks WHERE run_id=? ORDER BY created_at LIMIT ? OFFSET ?`).bind(runTasksMatch[1],limit,offset).all<any>();
    return json(rows.results.map((row:any)=>({...row,output:row.output_json?JSON.parse(row.output_json):null})));
   }
   const runMatch=url.pathname.match(/^\/api\/runs\/([0-9a-f-]{36})$/i);
   if(runMatch&&request.method==='GET'){
    const row=await env.DB.prepare('SELECT id,task,status,agent_count,completed_tasks,failed_tasks,pending_tasks,running_tasks,fanout_complete,created_at,started_at,completed_at,result_json,error_text,email_status,email_error,artifact_key,artifact_size,archive_status FROM runs WHERE id=? AND user_id=?').bind(runMatch[1],auth.sub).first<any>();
    if(!row)return json({error:'Run not found'},404);
    return json({...row,progress:row.agent_count?Math.round((Number(row.completed_tasks||0)+Number(row.failed_tasks||0))/row.agent_count*100):0,result:row.result_json?JSON.parse(row.result_json):null});
   }
   if(url.pathname==='/api/runs/agents'&&request.method==='GET'){return json(await env.DB.prepare('SELECT ar.id,ar.run_id,ar.agent_id,a.name,ar.status,ar.output_json,ar.error_text,ar.created_at FROM agent_runs ar JOIN runs r ON r.id=ar.run_id LEFT JOIN agents a ON a.id=ar.agent_id WHERE r.user_id=? ORDER BY ar.created_at DESC LIMIT 100').bind(auth.sub).all());}
   if(url.pathname==='/api/email/send'&&request.method==='POST'){
    const {to,subject,html}=await body<any>(request);if(!env.RESEND_API_KEY||!env.EMAIL_FROM)return json({error:'Configure Resend secrets'},400);
    const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:env.EMAIL_FROM,to,subject,html})});
    const data=await r.json();return json(data,r.status);
   }
   if(url.pathname==='/api/email/test'&&request.method==='POST'){const {to}=await body<any>(request);if(!env.RESEND_API_KEY||!env.EMAIL_FROM)return json({error:'Configure Resend secrets'},400);const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:env.EMAIL_FROM,to:to||env.COMPLETION_EMAIL_TO,subject:'AETHER email test',text:'Your AETHER workspace email integration is active.'})});return json(await r.json(),r.status);}
   return json({error:'Not found'},404);
  }catch(error){return json({error:error instanceof Error?error.message:'Internal error'},500);}
 },
 async queue(batch:MessageBatch<any>,env:Env){await consumeQueue(batch,env);}
};
