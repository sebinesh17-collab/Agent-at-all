export const serviceName = 'event-bus';
export const serviceDescription = "Workspace event bus";
export function validateEventBusInput(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}
