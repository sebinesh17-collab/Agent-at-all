const encoder = new TextEncoder();
const decoder = new TextDecoder();
function toB64(bytes: Uint8Array) {
  let s = ""; bytes.forEach(b => s += String.fromCharCode(b)); return btoa(s);
}
function fromB64(value: string) {
  return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}
async function aesKey(secret: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}
export async function encryptSecret(value: string, secret: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await aesKey(secret), encoder.encode(value));
  return { ciphertext: toB64(new Uint8Array(encrypted)), iv: toB64(iv) };
}
export async function decryptSecret(value: string, iv: string, secret: string) {
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(iv) }, await aesKey(secret), fromB64(value));
  return decoder.decode(plain);
}
