export const serviceName = 'authz';
export const serviceDescription = "Authorization checks";
export function validateAuthzInput(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}
