// lib/logger.ts
import pino from "pino";

const isDev = process.env.NODE_ENV === "development";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",

  // Pretty print in local dev only
  // In production (Vercel), output is JSON — faster and structured
  transport: isDev
    ? { target: "pino-pretty", options: { colorize: true } }
    : undefined,

  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },

  base: {
    env: process.env.NODE_ENV,
    app: "fitosys",
  },
});