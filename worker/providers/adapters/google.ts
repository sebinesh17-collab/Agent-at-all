import { openAICompatibleRequest } from '../compat';

export const provider = {
  id: 'google',
  name: "Google Gemini",
  endpoint: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
  protocol: 'openai',
  supportsTools: true,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'google', endpoint: input.endpoint || "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions" });
  },
};
