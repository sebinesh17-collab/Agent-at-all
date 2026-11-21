import { openAICompatibleRequest } from '../compat';
import { anthropicRequest, cohereRequest, azureRequest } from '../protocols';

export const provider = {
  id: 'azure-openai',
  name: "Azure OpenAI",
  endpoint: "",
  protocol: 'azure',
  supportsTools: true,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'azure-openai', endpoint: input.endpoint || "" });
  },
};
