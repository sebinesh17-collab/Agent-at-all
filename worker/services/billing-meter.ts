export const serviceName = 'billing-meter';
export const serviceDescription = "Usage metering";
export function validateBillingMeterInput(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}
