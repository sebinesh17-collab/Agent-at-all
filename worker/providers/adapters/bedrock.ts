import { openAICompatibleRequest } from '../compat';

export const provider = {
  id: 'bedrock',
  name: "AWS Bedrock",
  endpoint: "",
  protocol: 'bedrock',
  supportsTools: false,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'bedrock', endpoint: input.endpoint || "" });
  },
};
