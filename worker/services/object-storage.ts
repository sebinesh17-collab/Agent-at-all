import type { Env } from '../types';
import { storeFirebaseObject, storeFirebaseStreamObject, readFirebaseObject, deleteFirebaseObject, listFirebaseObjects } from './firebase-storage';
const firebaseEnabled=(env:Env)=>Boolean(env.FIREBASE_STORAGE_BUCKET&&env.FIREBASE_STORAGE_TOKEN);
export async function storeObject(env:Env,key:string,content:string){
  if(firebaseEnabled(env)){
    try{
      await storeFirebaseObject(env,key,content);
      let mirroredToR2=false;
      try{await env.ARTIFACTS.put(key,content,{httpMetadata:{contentType:'application/octet-stream'}});mirroredToR2=true;}catch(error){console.error('R2 mirror write failed',key,error);}
      return {key,backend:'firebase',mirroredToR2};
    }catch(error){
      await env.ARTIFACTS.put(key,content,{httpMetadata:{contentType:'application/octet-stream'}});
      return {key,backend:'cloudflare-r2-fallback',warning:error instanceof Error?error.message:String(error)};
    }
  }
  await env.ARTIFACTS.put(key,content,{httpMetadata:{contentType:'application/octet-stream'}});
  return {key,backend:'cloudflare-r2'};
}
export async function readObject(env:Env,key:string){
  if(firebaseEnabled(env)){
    try{return {key,content:await readFirebaseObject(env,key),backend:'firebase'};}
    catch(error){const fallback=await env.ARTIFACTS.get(key);if(fallback)return {key,content:await fallback.text(),backend:'cloudflare-r2-fallback',warning:error instanceof Error?error.message:String(error)};throw error;}
  }
  const obj=await env.ARTIFACTS.get(key);return obj?{key,content:await obj.text(),backend:'cloudflare-r2'}:null;
}
export async function deleteObject(env:Env,key:string){
  let firebaseError:string|undefined;
  if(firebaseEnabled(env)){try{await deleteFirebaseObject(env,key);}catch(error){firebaseError=error instanceof Error?error.message:String(error);}}
  await env.ARTIFACTS.delete(key);
  return {key,deleted:true,backend:firebaseEnabled(env)?'firebase+r2':'cloudflare-r2',warning:firebaseError};
}
export async function listObjects(env:Env,prefix:string){
  if(firebaseEnabled(env)){try{return await listFirebaseObjects(env,prefix);}catch(error){console.error('Firebase list failed; falling back to R2',error);}}
  const listed=await env.ARTIFACTS.list({prefix,limit:1000});return listed.objects.map(o=>({key:o.key,size:o.size,uploaded:o.uploaded}));
}

export async function storeBinaryStream(env:Env,key:string,content:ReadableStream<Uint8Array>,contentType='application/octet-stream'){
  const [firebaseStream,r2Stream]=content.tee();
  const r2Write=env.ARTIFACTS.put(key,r2Stream,{httpMetadata:{contentType}});
  if(firebaseEnabled(env)){
    try{await storeFirebaseStreamObject(env,key,firebaseStream);await r2Write;return {key,backend:'firebase',mirroredToR2:true};}
    catch(error){await r2Write;return {key,backend:'cloudflare-r2-fallback',warning:error instanceof Error?error.message:String(error)};}
  }
  await r2Write;return {key,backend:'cloudflare-r2'};
}
