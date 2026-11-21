import type { Env, FanoutMessage } from './types';

const FANOUT_BATCH = 100;
const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

async function createAgentWorkflow(env:Env,job:FanoutMessage,agentId:string){
  const workflowId=`${job.runId}-${agentId}`;
  try{
    await env.AGENT_WORKFLOW.create({id:workflowId,params:{runId:job.runId,userId:job.userId,agentId,callbackEmail:job.callbackEmail}});
  }catch(error){
    const detail=error instanceof Error?error.message:String(error);
    if(!detail.includes('instance.already_exists'))throw error;
  }
  await env.DB.prepare(`UPDATE run_agent_assignments SET workflow_instance_id=?
    WHERE run_id=? AND agent_id=? AND workflow_instance_id IS NULL`).bind(workflowId,job.runId,agentId).run();
}

export async function consumeQueue(batch: MessageBatch<FanoutMessage>, env: Env) {
  for (const message of batch.messages) {
    const job = message.body;
    try {
      if(job.kind==='plan'){
        const master=await env.DB.prepare(`SELECT agent_id FROM run_agent_assignments WHERE run_id=? AND ordinal=0 LIMIT 1`).bind(job.runId).first<any>();
        if(!master)throw new Error('Master Leader is missing from the run roster.');
        await createAgentWorkflow(env,job,master.agent_id);
        await env.DB.prepare("UPDATE runs SET status='planning',started_at=COALESCE(started_at,?) WHERE id=?").bind(Date.now(),job.runId).run();
        message.ack();
        continue;
      }
      if(job.kind!=='fanout')throw new Error('Unsupported queue message type.');
      const rows = await env.DB.prepare(`SELECT agent_id, ordinal FROM run_agent_assignments
        WHERE run_id=? AND ordinal>=? ORDER BY ordinal LIMIT ?`)
        .bind(job.runId, Math.max(1,job.offset), FANOUT_BATCH).all<{ agent_id: string; ordinal: number }>();

      const instances = await Promise.allSettled(rows.results.map(row=>createAgentWorkflow(env,job,row.agent_id)));
      const failed = instances.filter((item) => item.status === 'rejected');
      if (failed.length) throw new Error(`Workflow fan-out failed for ${failed.length} agents: ${String((failed[0] as PromiseRejectedResult).reason)}`);

      const nextOffset = rows.results.length ? rows.results[rows.results.length-1].ordinal + 1 : job.offset;
      const hasMore = rows.results.length === FANOUT_BATCH;
      await env.DB.prepare(`UPDATE runs SET status='running',fanout_complete=?,started_at=COALESCE(started_at,?) WHERE id=?`)
        .bind(hasMore ? 0 : 1, Date.now(), job.runId).run();

      if (hasMore) {
        // Keep below Cloudflare's 100 Workflow creations/second/workflow limit.
        await delay(1100);
        await env.TASK_QUEUE.send({ ...job, offset: nextOffset });
      }
      message.ack();
    } catch (error) {
      console.error('AETHER workflow fan-out failed', job.runId, job.offset, error);
      message.retry({ delaySeconds: 10 });
    }
  }
}
