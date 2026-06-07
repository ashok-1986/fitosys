import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';
const axiomToken = process.env.AXIOM_TOKEN;
const axiomDataset = process.env.AXIOM_DATASET ?? 'fitosys';

// Axiom HTTP batch sender — no worker threads, works on Vercel
class AxiomBatcher {
  private buffer: object[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;

  ingest(event: object) {
    this.buffer.push({
      ...event,
      _time: new Date().toISOString(),
    });
    // Flush after 500ms of inactivity or when buffer hits 50 events
    if (this.buffer.length >= 50) {
      this.flush();
    } else if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flush(), 500);
    }
  }

  private async flush() {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    if (this.buffer.length === 0) return;

    const events = this.buffer.splice(0);

    if (!axiomToken) return; // Axiom not configured — skip silently

    try {
      await fetch(`https://api.axiom.co/v1/datasets/${axiomDataset}/ingest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${axiomToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(events),
      });
    } catch {
      // Never throw from logger — swallow silently
    }
  }
}

const axiomBatcher = isProduction ? new AxiomBatcher() : null;

// Custom pino write destination that forwards to Axiom
const axiomDestination = isProduction ? {
  write(msg: string) {
    try {
      const parsed = JSON.parse(msg);
      axiomBatcher?.ingest(parsed);
    } catch {
      // Malformed JSON — skip
    }
  },
} : undefined;

const logger = pino(
  {
    level: isProduction ? 'info' : 'debug',
    base: {
      env: process.env.NODE_ENV,
      app: 'fitosys',
      version: process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    // In production: structured JSON to stdout + Axiom batcher
    // In development: human-readable via pino-pretty
  },
  isProduction
    ? pino.multistream([
        // Always write to stdout (Vercel captures this)
        { stream: process.stdout },
        // Also send to Axiom via HTTP batcher
        ...(axiomDestination ? [{ stream: axiomDestination }] : []),
      ])
    : // Development: pretty print
      (() => {
        try {
          // pino-pretty is a dev dependency
          return require('pino-pretty')({ colorize: true });
        } catch {
          return process.stdout; // fallback if pino-pretty not installed
        }
      })()
);

export { logger };
export default logger;
