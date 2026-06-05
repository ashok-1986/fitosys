// lib/logger.ts
import pino from "pino";

const isDev = process.env.NODE_ENV === "development";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",

  // Pretty print in local dev, pipe to Axiom in production
  transport: isDev
    ? { target: "pino-pretty", options: { colorize: true } }
    : {
        target: "@axiomhq/pino",
        options: {
          dataset: process.env.AXIOM_DATASET,
          token: process.env.AXIOM_TOKEN,
        },
      },

  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },

  base: {
    env: process.env.NODE_ENV,
    app: "fitosys",
  },
});