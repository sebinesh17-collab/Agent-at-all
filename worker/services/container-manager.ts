export const serviceName = 'container-manager';
export const serviceDescription = "Container lifecycle manager";
export function validateContainerManagerInput(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}
