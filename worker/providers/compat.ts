export type ProviderRequest = { providerId: string; endpoint: string; apiKey: string; model: string; systemPrompt: string; messages: Array<{role:string;content:string}>; temperature?: number; maxTokens?: number; tools?: unknown[] };
export async function openAICompatibleRequest(input: ProviderRequest) {
  if (!input.endpoint) throw new Error(`No endpoint configured for ${input.providerId}`);
  const response = await fetch(input.endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${input.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: input.model, messages: [{ role: 'system', content: input.systemPrompt }, ...input.messages], temperature: input.temperature ?? 0.2, max_tokens: input.maxTokens ?? 4096, ...(input.tools?.length ? { tools: input.tools, tool_choice: 'auto' } : {}) })
  });
  const payload: any = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${input.providerId} returned ${response.status}: ${payload.error?.message || payload.message || 'request failed'}`);
  return { text: payload.choices?.[0]?.message?.content ?? payload.output?.[0]?.content?.[0]?.text ?? '', toolCalls: payload.choices?.[0]?.message?.tool_calls ?? [], usage: payload.usage ?? null, raw: payload };
}
