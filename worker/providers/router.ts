import type { Env } from '../types';
import { decryptSecret } from '../crypto';

export async function selectProviderKeys(env:Env,provider:string,limit=25,routingKey='default'){
  const rows=await env.DB.prepare(`SELECT id,provider,encrypted_value,iv,endpoint,default_model FROM api_keys WHERE provider=? AND (status='active' OR (status='cooldown' AND COALESCE(cooldown_until,0)<?)) ORDER BY priority ASC,COALESCE(last_used_at,0) ASC LIMIT ?`).bind(provider,Date.now(),limit).all<any>();
  const candidates=rows.results;
  if(candidates.length>1){let hash=0;for(let i=0;i<routingKey.length;i++)hash=(hash*31+routingKey.charCodeAt(i))>>>0;const offset=hash%candidates.length;candidates.push(...candidates.splice(0,offset));}
  return Promise.all(candidates.map(async(row:any)=>({id:row.id,provider:row.provider,apiKey:await decryptSecret(row.encrypted_value,row.iv,env.ENCRYPTION_KEY),endpoint:row.endpoint,defaultModel:row.default_model})));
}
export async function markKeyUsed(env:Env,id:string){await env.DB.prepare("UPDATE api_keys SET status='active',cooldown_until=NULL,last_used_at=? WHERE id=?").bind(Date.now(),id).run();}
export async function markKeyFailure(env:Env,id:string,error:string){
  const invalid=/401|403|invalid api key|authentication/i.test(error);
  const limited=/429|rate.?limit/i.test(error);
  const transient=/5\d\d|temporar|timeout/i.test(error);
  const status=invalid?'invalid':limited?'cooldown':'active';
  const cooldown=limited?Date.now()+60000:transient?Date.now()+15000:null;
  await env.DB.prepare('UPDATE api_keys SET status=?,cooldown_until=?,last_used_at=? WHERE id=?').bind(status,cooldown,Date.now(),id).run();
}
