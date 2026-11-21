export const serviceName = 'run-service';
export const serviceDescription = "Run lifecycle service";
export function validateRunServiceInput(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}
