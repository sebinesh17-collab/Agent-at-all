import { openAICompatibleRequest } from '../compat';

export const provider = {
  id: 'custom',
  name: "Custom OpenAI Compatible",
  endpoint: "",
  protocol: 'openai',
  supportsTools: true,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'custom', endpoint: input.endpoint || "" });
  },
};
