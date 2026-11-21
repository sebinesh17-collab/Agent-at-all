export const serviceName = 'agent-policy';
export const serviceDescription = "Tool permission policy";
export function validateAgentPolicyInput(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}
