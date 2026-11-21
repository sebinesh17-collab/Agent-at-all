export const serviceName = 'api-key-router';
export const serviceDescription = "Provider key selection";
export function validateApiKeyRouterInput(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}
