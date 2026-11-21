import { openAICompatibleRequest } from '../compat';

export const provider = {
  id: 'huggingface',
  name: "Hugging Face",
  endpoint: "https://router.huggingface.co/v1/chat/completions",
  protocol: 'openai',
  supportsTools: true,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'huggingface', endpoint: input.endpoint || "https://router.huggingface.co/v1/chat/completions" });
  },
};
