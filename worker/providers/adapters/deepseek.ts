import { openAICompatibleRequest } from '../compat';

export const provider = {
  id: 'deepseek',
  name: "DeepSeek",
  endpoint: "https://api.deepseek.com/chat/completions",
  protocol: 'openai',
  supportsTools: true,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'deepseek', endpoint: input.endpoint || "https://api.deepseek.com/chat/completions" });
  },
};
