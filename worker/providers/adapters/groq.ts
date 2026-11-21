import { openAICompatibleRequest } from '../compat';

export const provider = {
  id: 'groq',
  name: "Groq",
  endpoint: "https://api.groq.com/openai/v1/chat/completions",
  protocol: 'openai',
  supportsTools: true,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'groq', endpoint: input.endpoint || "https://api.groq.com/openai/v1/chat/completions" });
  },
};
