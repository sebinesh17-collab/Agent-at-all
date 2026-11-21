import type { Env } from '../types';

async function callRunner(env:Env,userId:string,workspaceId:string,path:string,payload:Record<string,unknown>){
  const stub=env.LINUX_RUNNER.get(env.LINUX_RUNNER.idFromName(`user:${userId}:workspace:${workspaceId}`));
  const response=await stub.fetch(`https://linux/${path}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const result:any=await response.json();if(!response.ok)throw new Error(result.error||'Linux operation failed');return result;
}
export async function runLinuxCommand(env:Env,userId:string,input:{command:string;args:string[]},workspaceId='default') {
  const allowed=new Set(['pwd','ls','mkdir','cat','cp','mv','touch','npm','npx','pnpm','yarn','python','python3','pip','pip3','apt-get','git','node','java','javac','jar','gradle','mvn','./gradlew','./mvnw','gcc','g++','clang','clang++','cmake','ninja','llvm-config','sdkmanager','adb','find','grep','head','tail','tar','zip','unzip','df','du','ps','whoami','uname','which','curl','wget','make']);
  const command=input.command==='terminal.install'?(input.args[0]||'npm'):input.command;
  const args=input.command==='terminal.install'?input.args.slice(1):input.args;
  if(!allowed.has(command))throw new Error(`Command '${command}' is not allowed by workspace execution policy.`);
  if(args.some(arg=>arg.includes('\0')))throw new Error('Invalid command argument.');
  return callRunner(env,userId,workspaceId,'exec',{command,args});
}
export async function writeLinuxFile(env:Env,userId:string,path:string,content:string,workspaceId='default'){return callRunner(env,userId,workspaceId,'write',{path,content});}
export async function readLinuxFile(env:Env,userId:string,path:string,workspaceId='default'){return callRunner(env,userId,workspaceId,'read',{path});}
