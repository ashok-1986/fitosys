// lib/loggerHelpers.ts
import { logger } from "./logger";
import { NextRequest } from "next/server";

// Call this at the start of every API route
export function logRequest(req: NextRequest, routeName: string) {
  logger.info({
    route: routeName,
    method: req.method,
    ip: req.headers.get("x-forwarded-for") ?? "unknown",
  }, `Incoming request: ${routeName}`);
}

// Call this when something goes wrong
export function logError(error: unknown, context: string) {
  logger.error({
    context,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  }, `Error in ${context}`);
}

// Call this for important business events
export function logEvent(event: string, data: Record<string, unknown>) {
  logger.info({ event, ...data }, event);
}