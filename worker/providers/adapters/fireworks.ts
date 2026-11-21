import { openAICompatibleRequest } from '../compat';

export const provider = {
  id: 'fireworks',
  name: "Fireworks AI",
  endpoint: "https://api.fireworks.ai/inference/v1/chat/completions",
  protocol: 'openai',
  supportsTools: true,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'fireworks', endpoint: input.endpoint || "https://api.fireworks.ai/inference/v1/chat/completions" });
  },
};
