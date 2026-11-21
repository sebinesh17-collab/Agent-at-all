import type { Env } from "./types";
const enc = new TextEncoder();
function b64(bytes: ArrayBuffer) { return btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll("+","-").replaceAll("/","_").replaceAll("=",""); }
export async function signToken(payload: Record<string, unknown>, secret: string) {
  const body = b64(enc.encode(JSON.stringify({ ...payload, exp: Date.now() + 7 * 86400000 })).buffer);
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = b64(await crypto.subtle.sign("HMAC", key, enc.encode(body)));
  return `${body}.${sig}`;
}
export async function verifyToken(token: string | null, env: Env): Promise<false | {sub:string;email:string;role:string;exp:number}> {
  if (!token || !env.AUTH_SECRET) return false;
  const [body, signature] = token.split(".");
  if (!body || !signature) return false;
  const key = await crypto.subtle.importKey("raw", enc.encode(env.AUTH_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const normalized = signature.replaceAll("-","+").replaceAll("_","/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const sig = Uint8Array.from(atob(padded), c => c.charCodeAt(0));
  try {
    const valid = await crypto.subtle.verify("HMAC", key, sig, enc.encode(body));
    if (!valid) return false;
    const normalizedBody = body.replaceAll('-','+').replaceAll('_','/');
    const paddedBody = normalizedBody + '='.repeat((4 - normalizedBody.length % 4) % 4);
    const data = JSON.parse(atob(paddedBody));
    return data.exp > Date.now() ? data : false;
  } catch { return false; }
}
export function bearer(request: Request) { return request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? null; }
