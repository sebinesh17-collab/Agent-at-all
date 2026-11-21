import { openAICompatibleRequest } from '../compat';
import { anthropicRequest, cohereRequest, azureRequest } from '../protocols';

export const provider = {
  id: 'anthropic',
  name: "Anthropic",
  endpoint: "https://api.anthropic.com/v1/messages",
  protocol: 'anthropic',
  supportsTools: false,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'anthropic', endpoint: input.endpoint || "https://api.anthropic.com/v1/messages" });
  },
};
