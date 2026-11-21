import { openAICompatibleRequest } from '../compat';

export const provider = {
  id: 'mistral',
  name: "Mistral",
  endpoint: "https://api.mistral.ai/v1/chat/completions",
  protocol: 'openai',
  supportsTools: true,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'mistral', endpoint: input.endpoint || "https://api.mistral.ai/v1/chat/completions" });
  },
};
