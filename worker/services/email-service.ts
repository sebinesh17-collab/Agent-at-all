import type { Env } from '../types';
export async function sendCompletionEmail(env: Env, to: string, subject: string, text: string) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) throw new Error('Configure RESEND_API_KEY and EMAIL_FROM in Worker secrets.');
  const recipient = to || env.COMPLETION_EMAIL_TO;
  if (!recipient) throw new Error('Set COMPLETION_EMAIL_TO or provide a recipient.');
  const response = await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:env.EMAIL_FROM,to:recipient,subject,text})});
  const data:any = await response.json().catch(()=>({}));
  if (!response.ok) throw new Error(`Email provider error ${response.status}: ${data.message || 'send failed'}`);
  return data;
}
