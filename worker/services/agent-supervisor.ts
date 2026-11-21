export const serviceName = 'agent-supervisor';
export const serviceDescription = "Agent supervision";
export function validateAgentSupervisorInput(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}
