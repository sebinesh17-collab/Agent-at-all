import { DurableObject } from 'cloudflare:workers';
import type { Env } from './types';

const allowed = new Set([
  'pwd','ls','mkdir','cat','cp','mv','touch','npm','npx','pnpm','yarn','python','python3','pip','pip3',
  'apt-get','git','node','java','javac','jar','gradle','mvn','./gradlew','./mvnw','gcc','g++','clang','clang++','cmake','ninja','llvm-config','sdkmanager','adb','find','grep','head','tail','tar','zip','unzip','df','du','ps','whoami','uname','which','curl','wget','make'
]);
const safePath=(value:string)=>{
  const normalized=value.replaceAll('\\','/').replace(/^\/+/, '');
  const parts=normalized.split('/');
  if(!normalized||normalized.includes('\0')||parts.some(part=>part==='..'||part===''))throw new Error('Invalid workspace path');
  return `/workspace/${parts.join('/')}`;
};

export class LinuxRunner extends DurableObject<Env> {
  private async startContainer(){
    const container=this.ctx.container;
    if(!container)throw new Error('Cloudflare Container binding is unavailable for this Durable Object.');
    if(!container.running){
      const snapshotId=await this.ctx.storage.get<string>('workspaceSnapshotId');
      const allowedInstances=['lite','standard-1','standard-2','standard-3','standard-4'];
      const configured=String(this.env.WORKSPACE_INSTANCE||'standard-1');
      const instance=(allowedInstances.includes(configured)?configured:'standard-1') as 'lite'|'standard-1'|'standard-2'|'standard-3'|'standard-4';
      const options=snapshotId
        ? {containerSnapshot:{id:snapshotId},enableInternet:this.env.ALLOW_WORKSPACE_INTERNET==='true',instance}
        : {image:container.images.base,enableInternet:this.env.ALLOW_WORKSPACE_INTERNET==='true',instance};
      container.start(options as any);
    }
    await container.setInactivityTimeout(30*60*1000);
    return container;
  }
  private async execute(container:AetherContainer,command:string[],options:Parameters<AetherContainer['exec']>[1]={},timeoutMs=120000){
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeoutMs);
    try{const process=await container.exec(command,{...options,signal:controller.signal});void process.exitCode.then(()=>clearTimeout(timer),()=>clearTimeout(timer));return await process.output();}
    finally{clearTimeout(timer);}
  }
  private async checkpoint(container:AetherContainer){
    const last=Number(await this.ctx.storage.get<number>('workspaceSnapshotAt')||0);
    const current=Date.now();
    if(current-last<60000){
      return {id:String(await this.ctx.storage.get('workspaceSnapshotId')||''),size:Number(await this.ctx.storage.get('workspaceSnapshotSize')||0),name:'recent-checkpoint'};
    }
    const snapshot=await container.snapshotContainer({name:`aether-workspace-${current}`});
    await this.ctx.storage.put('workspaceSnapshotId',snapshot.id);
    await this.ctx.storage.put('workspaceSnapshotSize',snapshot.size);
    await this.ctx.storage.put('workspaceSnapshotAt',current);
    return snapshot;
  }
  async fetch(request:Request):Promise<Response>{
    const route=new URL(request.url).pathname;
    const body:any=await request.json().catch(()=>({}));
    try{
      if(route==='/status'&&request.method==='GET'){
        return Response.json({running:Boolean(this.ctx.container?.running),snapshotId:await this.ctx.storage.get('workspaceSnapshotId'),snapshotSize:await this.ctx.storage.get('workspaceSnapshotSize'),internetEnabled:this.env.ALLOW_WORKSPACE_INTERNET==='true'});
      }
      const container=await this.startContainer();
      if(route==='/archive'&&request.method==='POST'){
        const archive='/workspace/aether-project.zip';
        const result=await this.execute(container,['zip','-qr',archive,'.','-x','node_modules/*','.git/*','.env*','.dev.vars*','.wrangler/*','*.pem','*.key','*service-account*.json','*serviceAccount*.json','*firebase*admin*.json','*credentials*.json','aether-project.zip','.DS_Store'],{cwd:'/workspace'},300000);
        if(result.exitCode!==0)throw new Error(`ZIP packaging failed: ${new TextDecoder().decode(result.stderr)}`);
        await this.checkpoint(container);
        const bytes=await this.execute(container,['cat',archive],{cwd:'/workspace'},300000);
        if(bytes.exitCode!==0)throw new Error('Unable to read the generated project archive.');
        if(bytes.stdout.byteLength>100*1024*1024)throw new Error('Project ZIP exceeds the 100 MB inline archive limit. Use a smaller project or configure an R2-mounted workspace for large releases.');
        return new Response(bytes.stdout,{headers:{'Content-Type':'application/zip','Content-Disposition':'attachment; filename="aether-project.zip"','Content-Length':String(bytes.stdout.byteLength)}});
      }
      if(route==='/write'&&request.method==='POST'){
        const target=safePath(String(body.path||''));
        const parent=target.slice(0,target.lastIndexOf('/'));
        const mkdirResult=await this.execute(container,['mkdir','-p',parent],{cwd:'/workspace'},30000);
        if(mkdirResult.exitCode!==0)throw new Error(new TextDecoder().decode(mkdirResult.stderr));
        const content=String(body.content??'');
        const stdin=new ReadableStream<Uint8Array>({start(controller){controller.enqueue(new TextEncoder().encode(content));controller.close();}});
        const result=await this.execute(container,['tee',target],{cwd:'/workspace',stdin,stdout:'ignore'},60000);
        if(result.exitCode!==0)throw new Error(new TextDecoder().decode(result.stderr));
        const snapshot=await this.checkpoint(container);
        return Response.json({path:target,bytes:new TextEncoder().encode(content).length,checkpoint:{id:snapshot.id,size:snapshot.size}});
      }
      if(route==='/read'&&request.method==='POST'){
        const target=safePath(String(body.path||''));
        const result=await this.execute(container,['cat',target],{cwd:'/workspace'},60000);
        if(result.exitCode!==0)return Response.json({error:new TextDecoder().decode(result.stderr)},{status:404});
        return Response.json({path:target,content:new TextDecoder().decode(result.stdout)});
      }
      if(route==='/exec'&&request.method==='POST'){
        const command=String(body.command||'');
        const args=Array.isArray(body.args)?body.args.map(String):[];
        if(!allowed.has(command))return Response.json({error:'Command is not allowed by workspace policy.'},{status:403});
        if(args.length>40||args.some((arg:string)=>arg.length>2000||arg.includes('\0')))return Response.json({error:'Invalid command arguments.'},{status:400});
        const output=await this.execute(container,[command,...args],{cwd:'/workspace'},120000);
        const checkpoint=output.exitCode===0?await this.checkpoint(container):null;
        const decoder=new TextDecoder();
        return Response.json({command,args,stdout:decoder.decode(output.stdout),stderr:decoder.decode(output.stderr),exitCode:output.exitCode,checkpoint:checkpoint?{id:checkpoint.id,size:checkpoint.size}:null});
      }
      return Response.json({error:'Not found'},{status:404});
    }catch(error){
      return Response.json({error:error instanceof Error?error.message:'Container operation failed'},{status:500});
    }
  }
}
