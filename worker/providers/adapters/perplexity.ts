import { openAICompatibleRequest } from '../compat';

export const provider = {
  id: 'perplexity',
  name: "Perplexity",
  endpoint: "https://api.perplexity.ai/chat/completions",
  protocol: 'openai',
  supportsTools: true,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'perplexity', endpoint: input.endpoint || "https://api.perplexity.ai/chat/completions" });
  },
};
