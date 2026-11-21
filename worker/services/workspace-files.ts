export const serviceName = 'workspace-files';
export const serviceDescription = "Workspace file service";
export function validateWorkspaceFilesInput(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}
