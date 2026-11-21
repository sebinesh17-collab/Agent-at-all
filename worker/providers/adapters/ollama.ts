import { openAICompatibleRequest } from '../compat';

export const provider = {
  id: 'ollama',
  name: "Ollama",
  endpoint: "http://localhost:11434/v1/chat/completions",
  protocol: 'openai',
  supportsTools: false,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'ollama', endpoint: input.endpoint || "http://localhost:11434/v1/chat/completions" });
  },
};
