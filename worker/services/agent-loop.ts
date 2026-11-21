export const serviceName = 'agent-loop';
export const serviceDescription = "Bounded agent tool loop";
export function validateAgentLoopInput(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}
