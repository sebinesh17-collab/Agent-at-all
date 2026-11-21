export const serviceName = 'chat-service';
export const serviceDescription = "Chat conversation service";
export function validateChatServiceInput(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}
