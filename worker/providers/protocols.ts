import type { ProviderRequest } from './compat';

export async function anthropicRequest(input:ProviderRequest){
  const response=await fetch(input.endpoint||'https://api.anthropic.com/v1/messages',{method:'POST',headers:{'x-api-key':input.apiKey,'anthropic-version':'2023-06-01','content-type':'application/json'},body:JSON.stringify({model:input.model,system:input.systemPrompt,messages:input.messages.map(m=>({role:m.role==='assistant'?'assistant':'user',content:m.content})),max_tokens:input.maxTokens||4096,temperature:input.temperature??0.2})});
  const data:any=await response.json().catch(()=>({}));if(!response.ok)throw new Error(`Anthropic ${response.status}: ${data.error?.message||'request failed'}`);
  return {text:(data.content||[]).filter((x:any)=>x.type==='text').map((x:any)=>x.text).join('\n'),toolCalls:[],usage:data.usage||null,raw:data};
}
export async function cohereRequest(input:ProviderRequest){
  const response=await fetch(input.endpoint||'https://api.cohere.com/v2/chat',{method:'POST',headers:{Authorization:`Bearer ${input.apiKey}`,'content-type':'application/json'},body:JSON.stringify({model:input.model,messages:[{role:'system',content:input.systemPrompt},...input.messages.map(m=>({role:m.role,content:m.content}))],max_tokens:input.maxTokens||4096,temperature:input.temperature??0.2})});
  const data:any=await response.json().catch(()=>({}));if(!response.ok)throw new Error(`Cohere ${response.status}: ${data.message||'request failed'}`);
  return {text:(data.message?.content||[]).map((x:any)=>x.text||'').join('\n'),toolCalls:[],usage:data.usage||null,raw:data};
}
export async function azureRequest(input:ProviderRequest){
  if(!input.endpoint)throw new Error('Azure OpenAI requires the full deployment chat-completions endpoint.');
  const response=await fetch(input.endpoint,{method:'POST',headers:{'api-key':input.apiKey,'content-type':'application/json'},body:JSON.stringify({messages:[{role:'system',content:input.systemPrompt},...input.messages],temperature:input.temperature??0.2,max_tokens:input.maxTokens||4096})});
  const data:any=await response.json().catch(()=>({}));if(!response.ok)throw new Error(`Azure OpenAI ${response.status}: ${data.error?.message||'request failed'}`);
  return {text:data.choices?.[0]?.message?.content||'',toolCalls:data.choices?.[0]?.message?.tool_calls||[],usage:data.usage||null,raw:data};
}
