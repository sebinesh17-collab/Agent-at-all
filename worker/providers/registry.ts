import { provider as p_openai } from './adapters/openai';
import { provider as p_anthropic } from './adapters/anthropic';
import { provider as p_google } from './adapters/google';
import { provider as p_deepseek } from './adapters/deepseek';
import { provider as p_qwen } from './adapters/qwen';
import { provider as p_groq } from './adapters/groq';
import { provider as p_openrouter } from './adapters/openrouter';
import { provider as p_mistral } from './adapters/mistral';
import { provider as p_xai } from './adapters/xai';
import { provider as p_together } from './adapters/together';
import { provider as p_fireworks } from './adapters/fireworks';
import { provider as p_perplexity } from './adapters/perplexity';
import { provider as p_cerebras } from './adapters/cerebras';
import { provider as p_cohere } from './adapters/cohere';
import { provider as p_ollama } from './adapters/ollama';
import { provider as p_custom } from './adapters/custom';
import { provider as p_azure_openai } from './adapters/azure-openai';
import { provider as p_bedrock } from './adapters/bedrock';
import { provider as p_vertex } from './adapters/vertex';
import { provider as p_huggingface } from './adapters/huggingface';

export const providers = [
  p_openai,
  p_anthropic,
  p_google,
  p_deepseek,
  p_qwen,
  p_groq,
  p_openrouter,
  p_mistral,
  p_xai,
  p_together,
  p_fireworks,
  p_perplexity,
  p_cerebras,
  p_cohere,
  p_ollama,
  p_custom,
  p_azure_openai,
  p_bedrock,
  p_vertex,
  p_huggingface
];
export const providerById = new Map(providers.map(provider => [provider.id, provider]));
