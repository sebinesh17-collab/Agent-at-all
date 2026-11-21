export const serviceName = 'job-queue';
export const serviceDescription = "Queue publishing";
export function validateJobQueueInput(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}
