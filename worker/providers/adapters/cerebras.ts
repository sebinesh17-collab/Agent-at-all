import { openAICompatibleRequest } from '../compat';

export const provider = {
  id: 'cerebras',
  name: "Cerebras",
  endpoint: "https://api.cerebras.ai/v1/chat/completions",
  protocol: 'openai',
  supportsTools: true,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'cerebras', endpoint: input.endpoint || "https://api.cerebras.ai/v1/chat/completions" });
  },
};
