export const serviceName = 'prompt-manager';
export const serviceDescription = "Prompt version manager";
export function validatePromptManagerInput(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}
