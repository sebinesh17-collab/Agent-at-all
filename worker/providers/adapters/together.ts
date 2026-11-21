import { openAICompatibleRequest } from '../compat';

export const provider = {
  id: 'together',
  name: "Together AI",
  endpoint: "https://api.together.xyz/v1/chat/completions",
  protocol: 'openai',
  supportsTools: true,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'together', endpoint: input.endpoint || "https://api.together.xyz/v1/chat/completions" });
  },
};
