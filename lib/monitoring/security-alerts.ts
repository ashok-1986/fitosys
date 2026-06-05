import { logger } from "../logger";

/**
 * Triggers a high-priority alert for authentication failures.
 * Axiom can be configured to alert on these specific tags.
 */
export function alertAuthFailure(userId: string, reason: string, ip?: string) {
  logger.error({
    event: "security_alert",
    type: "auth_failure",
    userId,
    reason,
    ip,
    priority: "high"
  }, "Authentication Failure Detected");
}

/**
 * Triggers a high-priority alert when a critical webhook fails verification or is missing.
 */
export function alertWebhookFailure(provider: string, reason: string, headers: any) {
  logger.error({
    event: "security_alert",
    type: "webhook_failure",
    provider,
    reason,
    headers,
    priority: "high"
  }, "Critical Webhook Verification Failed");
}

/**
 * Triggers a high-priority alert when PII encryption or decryption fails.
 */
export function alertEncryptionError(operation: "encrypt" | "decrypt", reason: string) {
  logger.error({
    event: "security_alert",
    type: "encryption_error",
    operation,
    reason,
    priority: "critical"
  }, "PII Encryption/Decryption Error");
}
