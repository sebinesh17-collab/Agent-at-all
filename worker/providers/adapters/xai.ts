import { openAICompatibleRequest } from '../compat';

export const provider = {
  id: 'xai',
  name: "xAI",
  endpoint: "https://api.x.ai/v1/chat/completions",
  protocol: 'openai',
  supportsTools: true,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'xai', endpoint: input.endpoint || "https://api.x.ai/v1/chat/completions" });
  },
};
