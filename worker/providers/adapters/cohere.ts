import { openAICompatibleRequest } from '../compat';
import { anthropicRequest, cohereRequest, azureRequest } from '../protocols';

export const provider = {
  id: 'cohere',
  name: "Cohere",
  endpoint: "https://api.cohere.com/v2/chat",
  protocol: 'cohere',
  supportsTools: false,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'cohere', endpoint: input.endpoint || "https://api.cohere.com/v2/chat" });
  },
};
