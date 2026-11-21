import type { Env, JobMessage } from '../types';

const INSERT_ASSIGNMENT = `INSERT OR IGNORE INTO run_agent_assignments
  (id,run_id,agent_id,ordinal,status,created_at) VALUES (?,?,?,?, 'pending',?)`;

export async function dispatchRun(env: Env, message: JobMessage) {
  const id = crypto.randomUUID();
  let rows: { id: string }[];
  if (Array.isArray(message.agentIds) && message.agentIds.length) {
    if (message.agentIds.length > 16111) throw new Error('A run can select at most 16,111 registered agents.');
    const unique = [...new Set(message.agentIds)];
    const placeholders = unique.map(() => '?').join(',');
    const selected = await env.DB.prepare(`SELECT id FROM agents WHERE enabled=1 AND id IN (${placeholders}) ORDER BY CASE hierarchy_level WHEN 'master' THEN 0 WHEN 'principal' THEN 1 WHEN 'hod' THEN 2 WHEN 'team_leader' THEN 3 ELSE 4 END,agent_index,id`)
      .bind(...unique).all<{ id: string }>();
    rows = selected.results;
  } else {
    const selected = await env.DB.prepare('SELECT id FROM agents WHERE enabled=1 ORDER BY CASE hierarchy_level WHEN \'master\' THEN 0 WHEN \'principal\' THEN 1 WHEN \'hod\' THEN 2 WHEN \'team_leader\' THEN 3 ELSE 4 END, agent_index, id').all<{ id: string }>();
    rows = selected.results;
  }
  if (!rows.length) throw new Error('No enabled agents are registered. Apply migrations and enable the organization first.');
  const master=await env.DB.prepare("SELECT id FROM agents WHERE id='master-leader-001' AND enabled=1").first<{id:string}>();
  if(!master)throw new Error('The Master Leader must be enabled to plan and delegate a run.');
  if(!rows.some(agent=>agent.id===master.id))rows.unshift({id:master.id});

  const now = Date.now();
  await env.DB.prepare(`INSERT INTO runs
    (id,task,status,agent_count,created_at,user_id,pending_tasks,completed_tasks,failed_tasks)
    VALUES (?,?,'queued',?,?,?,?,0,0)`)
    .bind(id, message.task, rows.length, now, message.userId, rows.length).run();

  // Persist the run's agent roster before fan-out so retries cannot change the selected organization.
  for (let offset = 0; offset < rows.length; offset += 100) {
    const chunk = rows.slice(offset, offset + 100);
    const statements = chunk.map((agent, index) => env.DB.prepare(INSERT_ASSIGNMENT)
      .bind(crypto.randomUUID(), id, agent.id, offset + index, now));
    await env.DB.batch(statements);
  }

  await env.TASK_QUEUE.send({
    kind: 'plan',
    runId: id,
    userId: message.userId,
    task: message.task,
    callbackEmail: message.callbackEmail,
    offset: 0,
  });
  return { runId: id, status: 'queued', agentCount: rows.length, workflowStatus: 'fanout_queued' };
}
