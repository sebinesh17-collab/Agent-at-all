import { WorkflowEntrypoint } from 'cloudflare:workers';
import type { WorkflowEvent, WorkflowStep } from 'cloudflare:workers';
import type { AgentWorkflowPayload, Env, JobMessage } from './types';
import { runOneAgent } from './agents/runner';
import { synthesizeRun } from './agents/runtime';
import { sendCompletionEmail } from './services/email-service';
import { createProjectArchive } from './services/project-archive';

function parseJson(value: unknown, fallback: unknown = {}) {
  if (typeof value !== 'string') return fallback;
  try { return JSON.parse(value); } catch { return fallback; }
}

const SPECIALIST_CATEGORIES = [
  'frontend_development','backend_development','full_stack_development','api_development','database_engineering',
  'ai_engineering','machine_learning','linux_infrastructure','devops','cloud_engineering','security_engineering',
  'testing_qa','debugging','code_review','ui_ux_design','android_development','compiler_engineering','documentation',
  'performance_optimization','deployment','git_github','research','automation','integration','data_engineering',
  'department_01','department_02','department_03','department_04','department_05','department_06','department_07','department_08','department_09','department_10',
];
function fallbackPlan(task:string){
  const work_packages:any[]=[];
  for(let d=1;d<=10;d++)for(const category of SPECIALIST_CATEGORIES){
    const department_code=`D${String(d).padStart(2,'0')}`;
    work_packages.push({department_code,category,task:`${task}\n\nSpecialist package: ${category} for department ${department_code}. Produce a distinct analysis or implementation slice; do not duplicate other agents.`,acceptance_criteria:['Submit concrete evidence or artifacts','List assumptions and blockers','Run relevant checks when code is changed']});
  }
  return {summary:'Fallback role-and-department plan created because the Master Leader response was not valid structured JSON.',work_packages};
}
function parseMasterPlan(text:string,task:string){
  const cleaned=String(text||'').replace(/```(?:json)?/gi,'').trim();
  const candidate=cleaned.match(/\{[\s\S]*\}/)?.[0];
  if(candidate){
    try{
      const parsed=JSON.parse(candidate);
      const packages=Array.isArray(parsed.work_packages)?parsed.work_packages.filter((p:any)=>p&&typeof p.task==='string'&&p.task.trim()).slice(0,500).map((p:any)=>({
        department_code:/^D(0[1-9]|10)$/.test(String(p.department_code||''))?String(p.department_code):'D01',
        category:String(p.category||'research').slice(0,80),
        task:String(p.task).slice(0,6000),
        acceptance_criteria:Array.isArray(p.acceptance_criteria)?p.acceptance_criteria.slice(0,10):[],
      })):[];
      if(packages.length)return {summary:String(parsed.summary||'Master Leader plan'),work_packages:packages};
    }catch{}
  }
  return fallbackPlan(task);
}
function chooseWorkPackage(plan:any,row:any){
  const packages=Array.isArray(plan?.work_packages)?plan.work_packages:[];
  if(!packages.length)return `Execute your ${row.category||row.hierarchy_level} responsibility for the original objective.`;
  const dept=packages.filter((p:any)=>p.department_code===row.department_code);
  const exact=dept.filter((p:any)=>p.category===row.category);
  const category=packages.filter((p:any)=>p.category===row.category);
  const candidates=exact.length?exact:category.length?category:dept.length?dept:packages;
  const index=Math.max(0,Number(row.agent_index)||0)%candidates.length;
  const selected=candidates[index];
  return `${selected.task}\n\nAcceptance criteria: ${JSON.stringify(selected.acceptance_criteria||[])}\nUnique execution shard: ${row.id} (${row.agent_index??'custom'}). Avoid duplicating work already assigned to sibling agents.`;
}

async function finalizeIfReady(env: Env, job: JobMessage) {
  const counts = await env.DB.prepare(`SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) AS completed,
      SUM(CASE WHEN status='failed' THEN 1 ELSE 0 END) AS failed,
      SUM(CASE WHEN status='blocked' THEN 1 ELSE 0 END) AS blocked,
      SUM(CASE WHEN status IN ('pending','running') THEN 1 ELSE 0 END) AS unfinished
    FROM run_agent_assignments WHERE run_id=?`).bind(job.runId).first<any>();
  if (!counts || Number(counts.unfinished || 0) > 0 || Number(counts.total || 0) === 0) return { finalized: false, counts };

  const claim = await env.DB.prepare(`UPDATE runs SET status='finalizing'
    WHERE id=? AND status NOT IN ('finalizing','completed','completed_with_errors','failed')`).bind(job.runId).run();
  if (Number(claim.meta?.changes || 0) === 0) return { finalized: false, counts };

  const rows = await env.DB.prepare(`SELECT ar.agent_id, a.name, a.category, a.hierarchy_level,
      ar.status, ar.output_json, ar.error_text
    FROM agent_runs ar LEFT JOIN agents a ON a.id=ar.agent_id
    WHERE ar.run_id=? ORDER BY a.hierarchy_level, a.agent_index LIMIT 120`).bind(job.runId).all<any>();
  const outputs = rows.results.map((row: any) => {
    const stored = parseJson(row.output_json, {});
    return {
      agentId: row.agent_id,
      name: row.name || row.agent_id,
      category: row.category,
      hierarchyLevel: row.hierarchy_level,
      status: row.status,
      output: String(stored.output || '').slice(0, 1400),
      error: row.error_text || stored.error || undefined,
      toolTrace: stored.toolTrace || [],
    };
  });
  let synthesis:any;
  try { synthesis = await synthesizeRun(env, job, outputs); }
  catch (error) { synthesis = { status: 'failed', reason: error instanceof Error ? error.message : String(error) }; }
  let archive:any=null;let archiveError:string|undefined;
  try { archive=await createProjectArchive(env,job.userId,job.runId); }
  catch(error){archiveError=error instanceof Error?error.message:String(error);console.error('AETHER project archive failed',job.runId,error);}
  let downloadUrl:string|undefined;
  if(archive&&env.PUBLIC_APP_URL){
    try{
      const token=crypto.randomUUID()+crypto.randomUUID();
      const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));
      const tokenHash=[...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
      await env.DB.prepare('INSERT INTO download_tokens(token_hash,user_id,run_id,object_key,expires_at,max_downloads,downloads,created_at) VALUES(?,?,?,?,?,5,0,?)')
        .bind(tokenHash,job.userId,job.runId,archive.key,Date.now()+7*24*60*60*1000,Date.now()).run();
      downloadUrl=`${env.PUBLIC_APP_URL.replace(/\/$/,'')}/api/download/${token}`;
    }catch(error){console.error('AETHER secure download token creation failed',job.runId,error);}
  }
  const failed = Number(counts.failed || 0) + Number(counts.blocked || 0);
  const finalStatus = failed > 0 || archiveError ? 'completed_with_errors' : 'completed';
  const result = {
    summary: [synthesis?.text || synthesis?.reason || 'Agent execution finished. Review the per-agent run records for details.',archiveError?`Project ZIP packaging failed: ${archiveError}`:archive?`Project archive is ready (${archive.size} bytes).`:null].filter(Boolean).join('\n\n'),
    synthesisStatus: synthesis?.status || 'unavailable',
    archive:archive?{key:archive.key,size:archive.size,downloadUrl:downloadUrl||null}:null,
    archiveError:archiveError||null,
    counts: {
      total: Number(counts.total || 0),
      completed: Number(counts.completed || 0),
      failed: Number(counts.failed || 0),
      blocked: Number(counts.blocked || 0),
    },
    sample: outputs.slice(0, 40),
  };
  await env.DB.prepare(`UPDATE runs SET status=?,completed_at=?,completed_tasks=?,failed_tasks=?,pending_tasks=0,running_tasks=0,
    result_json=?,synthesis_json=?,artifact_key=?,artifact_size=?,archive_status=? WHERE id=?`)
    .bind(finalStatus, Date.now(), Number(counts.completed || 0), failed, JSON.stringify(result), JSON.stringify(synthesis), archive?.key||null,archive?.size||null,archive?'ready':'failed',job.runId).run();

  const recipient = job.callbackEmail || env.COMPLETION_EMAIL_TO;
  if (recipient && env.RESEND_API_KEY && env.EMAIL_FROM) {
    try {
      await sendCompletionEmail(env, recipient, `AETHER project ${finalStatus}: ${job.runId}`,
        `Project run: ${job.runId}\nStatus: ${finalStatus}\nTotal agents: ${counts.total}\nCompleted: ${counts.completed}\nFailed: ${counts.failed}\nBlocked: ${counts.blocked}\n\nSummary:\n${result.summary}\n\nDownload: ${downloadUrl||'Sign in to AETHER and open this run to download the archive.'}\n\nOpen AETHER Run History to inspect per-agent execution records.`);
      await env.DB.prepare("UPDATE runs SET email_status='sent',email_error=NULL WHERE id=?").bind(job.runId).run();
    } catch (error) {
      await env.DB.prepare("UPDATE runs SET email_status='failed',email_error=? WHERE id=?").bind(String(error), job.runId).run();
      console.error('AETHER completion email failed', job.runId, error);
    }
  } else {
    await env.DB.prepare("UPDATE runs SET email_status='not_configured' WHERE id=?").bind(job.runId).run();
  }
  return { finalized: true, counts, status: finalStatus };
}

export class AgentTaskWorkflow extends WorkflowEntrypoint<Env, AgentWorkflowPayload> {
  async run(event: WorkflowEvent<AgentWorkflowPayload>, step: WorkflowStep) {
    const job = event.payload;
    let taskForRecovery = '';
    try {
    const loaded = await step.do('load-agent-configuration', async () => {
      const [row, run] = await Promise.all([
        this.env.DB.prepare(`SELECT id,name,role,provider,model,system_prompt,allowed_tools,
            max_parallel_tasks,category,hierarchy_level,job_title,skills,agent_index,manager_agent_id,department_code,execution_limits
          FROM agents WHERE id=? AND enabled=1`).bind(job.agentId).first<any>(),
        this.env.DB.prepare('SELECT task,plan_json FROM runs WHERE id=? AND user_id=?').bind(job.runId, job.userId).first<any>(),
      ]);
      if (!row) throw new Error(`Agent ${job.agentId} is missing or disabled.`);
      if (!run?.task) throw new Error(`Run ${job.runId} is missing.`);
      await this.env.DB.prepare(`UPDATE run_agent_assignments SET status='running',started_at=COALESCE(started_at,?)
        WHERE run_id=? AND agent_id=? AND status='pending'`).bind(Date.now(),job.runId,job.agentId).run();
      await this.env.DB.prepare(`UPDATE runs SET
        running_tasks=(SELECT COUNT(*) FROM run_agent_assignments WHERE run_id=? AND status='running'),
        pending_tasks=(SELECT COUNT(*) FROM run_agent_assignments WHERE run_id=? AND status='pending')
        WHERE id=?`).bind(job.runId,job.runId,job.runId).run();
      return {
        task: String(run.task),
        plan: parseJson(run.plan_json, null),
        agent: {
          id: row.id,
          name: row.name,
          role: row.job_title || row.role,
          job: `${row.category || row.role}; hierarchy=${row.hierarchy_level}; manager=${row.manager_agent_id || 'none'}; unique agent index=${row.agent_index ?? 'custom'}`,
          provider: row.provider,
          model: row.model,
          systemPrompt: row.system_prompt,
          allowedTools: parseJson(row.allowed_tools, []),
          maxParallelTasks: row.max_parallel_tasks,
          executionLimits: parseJson(row.execution_limits, {}),
          category: row.category,
          agentIndex: row.agent_index,
          managerAgentId: row.manager_agent_id,
          departmentCode: row.department_code,
        },
      };
    });
    const agent = loaded.agent;
    const task = job.agentId==='master-leader-001' ? loaded.task : chooseWorkPackage(loaded.plan,{id:job.agentId,category:agent.category,agent_index:agent.agentIndex,department_code:agent.departmentCode});
    taskForRecovery = task;
    await step.do('register-agent-task', async()=>{
      await this.env.DB.prepare(`INSERT INTO agent_tasks(id,project_id,run_id,agent_id,manager_agent_id,priority,description,status,created_at,started_at)
        VALUES(?,?,?,?,?,'normal',?,'running',?,?) ON CONFLICT(id) DO UPDATE SET description=excluded.description,status='running',started_at=excluded.started_at`)
        .bind(`${job.runId}:${job.agentId}`,job.runId,job.runId,job.agentId,agent.managerAgentId,task.slice(0,12000),Date.now(),Date.now()).run();
      return {registered:true};
    });

    const output = await step.do('execute-specialist-agent', {
      retries: { limit: 2, delay: '10 seconds', backoff: 'exponential' },
      timeout: '15 minutes',
    }, async () => {
      await this.env.DB.prepare("UPDATE agents SET status='running',current_task=?,last_active_at=? WHERE id=?")
        .bind(task.slice(0, 1000), Date.now(), job.agentId).run();
      return runOneAgent(this.env, { ...job, task, agentIds: [job.agentId] }, agent);
    });

    await step.do('persist-agent-result', async () => {
      const terminalStatus = output.status === 'completed' ? 'completed' : output.status === 'blocked' ? 'blocked' : 'failed';
      const compact = JSON.stringify({ output: String(output.output || '').slice(0, 12000), toolTrace: output.toolTrace || [], durationMs: output.durationMs || 0 });
      await this.env.DB.prepare(`INSERT INTO agent_runs
        (id,run_id,agent_id,status,output_json,error_text,created_at,completed_at)
        VALUES (?,?,?,?,?,?,?,?)
        ON CONFLICT(run_id,agent_id) DO UPDATE SET status=excluded.status,output_json=excluded.output_json,
          error_text=excluded.error_text,completed_at=excluded.completed_at`)
        .bind(crypto.randomUUID(), job.runId, job.agentId, terminalStatus, compact, output.error || null, Date.now(), Date.now()).run();
      await this.env.DB.prepare(`UPDATE run_agent_assignments SET status=?,error_text=?,completed_at=?
        WHERE run_id=? AND agent_id=?`)
        .bind(terminalStatus, output.error || null, Date.now(), job.runId, job.agentId).run();
      await this.env.DB.prepare(`UPDATE agent_tasks SET status=?,output_json=?,error_text=?,completed_at=? WHERE run_id=? AND agent_id=?`)
        .bind(terminalStatus,compact,output.error||null,Date.now(),`${job.runId}:${job.agentId}`).run();
      await this.env.DB.prepare("UPDATE agents SET status='idle',current_task=NULL,last_active_at=? WHERE id=?")
        .bind(Date.now(), job.agentId).run();
      await this.env.DB.prepare('DELETE FROM workspace_file_locks WHERE run_id=? AND agent_id=?').bind(job.runId,job.agentId).run();
      await this.env.DB.prepare(`UPDATE runs SET
        completed_tasks=(SELECT COUNT(*) FROM run_agent_assignments WHERE run_id=? AND status='completed'),
        failed_tasks=(SELECT COUNT(*) FROM run_agent_assignments WHERE run_id=? AND status IN ('failed','blocked')),
        pending_tasks=(SELECT COUNT(*) FROM run_agent_assignments WHERE run_id=? AND status='pending'),
        running_tasks=(SELECT COUNT(*) FROM run_agent_assignments WHERE run_id=? AND status='running')
        WHERE id=?`).bind(job.runId,job.runId,job.runId,job.runId,job.runId).run();
      return { status: terminalStatus };
    });

    if(job.agentId==='master-leader-001'){
      await step.do('publish-master-plan-and-start-delegation', async()=>{
        const plan=parseMasterPlan(output.output||'',loaded.task);
        await this.env.DB.prepare('UPDATE runs SET plan_json=? WHERE id=?').bind(JSON.stringify(plan),job.runId).run();
        await this.env.TASK_QUEUE.send({kind:'fanout',runId:job.runId,userId:job.userId,task:loaded.task,callbackEmail:job.callbackEmail,offset:1});
        return {packages:plan.work_packages.length};
      });
    }
    const finalization = await step.do('check-run-completion', async () => finalizeIfReady(this.env, { ...job, task: loaded.task }));
    return { runId: job.runId, agentId: job.agentId, status: output.status, finalization };
    } catch (error) {
      const failure = error instanceof Error ? error.message : String(error);
      const run = await this.env.DB.prepare('SELECT task FROM runs WHERE id=? AND user_id=?').bind(job.runId, job.userId).first<any>();
      taskForRecovery = taskForRecovery || String(run?.task || 'Agent task failed before execution.');
      await step.do('persist-terminal-agent-failure', { retries: { limit: 3, delay: '10 seconds', backoff: 'exponential' }, timeout: '2 minutes' }, async () => {
        const current=await this.env.DB.prepare('SELECT status FROM run_agent_assignments WHERE run_id=? AND agent_id=?').bind(job.runId,job.agentId).first<any>();
        const alreadyTerminal=Boolean(current&&['completed','failed','blocked'].includes(current.status));
        if(!alreadyTerminal){
          const now=Date.now();
          await this.env.DB.prepare(`UPDATE run_agent_assignments SET status='failed',error_text=?,completed_at=? WHERE run_id=? AND agent_id=?`)
            .bind(failure.slice(0,4000),now,job.runId,job.agentId).run();
          await this.env.DB.prepare(`INSERT INTO agent_runs (id,run_id,agent_id,status,output_json,error_text,created_at,completed_at)
            VALUES (?,?,?,'failed',?,?,?,?) ON CONFLICT(run_id,agent_id) DO UPDATE SET status='failed',error_text=excluded.error_text,completed_at=excluded.completed_at`)
            .bind(crypto.randomUUID(),job.runId,job.agentId,JSON.stringify({error:failure.slice(0,4000)}),failure.slice(0,4000),now,now).run();
          await this.env.DB.prepare(`INSERT INTO agent_tasks(id,project_id,run_id,agent_id,priority,description,status,created_at,completed_at,error_text)
            VALUES(?,?,?,?,'normal',?,'failed',?,?,?) ON CONFLICT(id) DO UPDATE SET status='failed',error_text=excluded.error_text,completed_at=excluded.completed_at`)
            .bind(`${job.runId}:${job.agentId}`,job.runId,job.runId,job.agentId,taskForRecovery.slice(0,12000),now,now,failure.slice(0,4000)).run();
          await this.env.DB.prepare("UPDATE agents SET status='idle',current_task=NULL,last_active_at=? WHERE id=?").bind(now,job.agentId).run();
          await this.env.DB.prepare(`UPDATE runs SET
            completed_tasks=(SELECT COUNT(*) FROM run_agent_assignments WHERE run_id=? AND status='completed'),
            failed_tasks=(SELECT COUNT(*) FROM run_agent_assignments WHERE run_id=? AND status IN ('failed','blocked')),
            pending_tasks=(SELECT COUNT(*) FROM run_agent_assignments WHERE run_id=? AND status='pending'),
            running_tasks=(SELECT COUNT(*) FROM run_agent_assignments WHERE run_id=? AND status='running')
            WHERE id=?`).bind(job.runId,job.runId,job.runId,job.runId,job.runId).run();
        }
        await this.env.DB.prepare('DELETE FROM workspace_file_locks WHERE run_id=? AND agent_id=?').bind(job.runId,job.agentId).run();
        return { recorded: !alreadyTerminal, alreadyTerminal };
      });
      if(job.agentId==='master-leader-001'){
        await step.do('publish-fallback-plan-after-master-failure', async()=>{
          const existing=await this.env.DB.prepare('SELECT plan_json FROM runs WHERE id=?').bind(job.runId).first<any>();
          const plan=existing?.plan_json?parseJson(existing.plan_json,fallbackPlan(taskForRecovery)) as any:fallbackPlan(taskForRecovery);
          if(!existing?.plan_json)await this.env.DB.prepare('UPDATE runs SET plan_json=? WHERE id=?').bind(JSON.stringify(plan),job.runId).run();
          await this.env.TASK_QUEUE.send({kind:'fanout',runId:job.runId,userId:job.userId,task:taskForRecovery,callbackEmail:job.callbackEmail,offset:1});
          return {packages:plan.work_packages?.length||0};
        });
      }
      const finalization = await step.do('check-run-completion-after-failure', async () => finalizeIfReady(this.env, { ...job, task: taskForRecovery }));
      return { runId: job.runId, agentId: job.agentId, status: 'failed', error: failure, finalization };
    }
  }
}
