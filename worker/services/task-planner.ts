export const serviceName = 'task-planner';
export const serviceDescription = "Task dependency planner";
export function validateTaskPlannerInput(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}
