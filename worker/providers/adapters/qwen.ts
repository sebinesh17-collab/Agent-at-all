import { openAICompatibleRequest } from '../compat';

export const provider = {
  id: 'qwen',
  name: "Qwen",
  endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
  protocol: 'openai',
  supportsTools: true,
  async generate(input: Parameters<typeof openAICompatibleRequest>[0]) {
    return openAICompatibleRequest({ ...input, providerId: 'qwen', endpoint: input.endpoint || "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions" });
  },
};
