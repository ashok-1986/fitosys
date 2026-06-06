import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';
const axiomToken = process.env.AXIOM_TOKEN;
const axiomDataset = process.env.AXIOM_DATASET ?? 'fitosys';

class AxiomBatcher {
  private buffer: object[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;

  ingest(event: object) {
    this.buffer.push({ ...event, _time: new Date().toISOString() });
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
    if (!axiomToken) return;
    try {
      await fetch(`https://api.axiom.co/v1/datasets/${axiomDataset}/ingest`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${axiomToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(events),
      });
    } catch {
      // Never throw from logger
    }
  }
}

const axiomBatcher = isProduction ? new AxiomBatcher() : null;

const logger = isProduction
  ? pino(
      {
        level: 'info',
        base: {
          env: process.env.NODE_ENV,
          app: 'fitosys',
          version: process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      pino.multistream([
        { stream: process.stdout },
        {
          stream: {
            write(msg: string) {
              try {
                const parsed = JSON.parse(msg);
                axiomBatcher?.ingest(parsed);
              } catch {
                // Malformed JSON — skip
              }
            },
          },
        },
      ]),
    )
  : pino({
      level: 'debug',
      transport: { target: 'pino-pretty', options: { colorize: true } },
      base: {
        env: process.env.NODE_ENV,
        app: 'fitosys',
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    });

export { logger };
export default logger;
