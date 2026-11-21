import { openAICompatibleRequest } from '../compat';

export const provider = {
  id: 'openrouter',
  name: "OpenRouter",
  endpoint: "https://openrouter.ai/api/v1/chat/completions",
  protocol: 'openai',
  supportsTools: true,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'openrouter', endpoint: input.endpoint || "https://openrouter.ai/api/v1/chat/completions" });
  },
};
