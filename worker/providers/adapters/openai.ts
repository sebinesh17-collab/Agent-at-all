import { openAICompatibleRequest } from '../compat';

export const provider = {
  id: 'openai',
  name: "OpenAI",
  endpoint: "https://api.openai.com/v1/chat/completions",
  protocol: 'openai',
  supportsTools: true,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'openai', endpoint: input.endpoint || "https://api.openai.com/v1/chat/completions" });
  },
};
