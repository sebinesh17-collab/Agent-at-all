export const serviceName = 'agent-memory';
export const serviceDescription = "Agent memory access";
export function validateAgentMemoryInput(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}
