import type { Env } from '../types';
import { storeBinaryStream } from './object-storage';
export async function createProjectArchive(env:Env,userId:string,runId:string){
  const stub=env.LINUX_RUNNER.get(env.LINUX_RUNNER.idFromName(`user:${userId}:workspace:${runId}`));
  const response=await stub.fetch('https://linux/archive',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
  if(!response.ok)throw new Error(`Project ZIP packaging failed (${response.status}): ${(await response.text()).slice(0,2000)}`);
  const key=`${userId}/runs/${runId}/releases/aether-project.zip`;
  const size=Number(response.headers.get('content-length')||0);
  if(!response.body)throw new Error('ZIP package response had no file stream.');
  const stored=await storeBinaryStream(env,key,response.body,'application/zip');
  return {key,size,backend:stored.backend,mirroredToR2:(stored as any).mirroredToR2||false};
}
