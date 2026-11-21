import { openAICompatibleRequest } from '../compat';

export const provider = {
  id: 'vertex',
  name: "Vertex AI",
  endpoint: "",
  protocol: 'vertex',
  supportsTools: false,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'vertex', endpoint: input.endpoint || "" });
  },
};
