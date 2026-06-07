import { logger } from './logger.helper';

export type PollingOptions = {
  timeoutMs?: number;
  intervalMs?: number;
  pollingName?: string;
  failureMessage?: string;
};

const DEFAULT_TIMEOUT_MS = 5_000;
const DEFAULT_INTERVAL_MS = 500;

function sleep(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

export async function waitUntil<T>(
  action: (attempt: number) => Promise<T>,
  condition: (result: T) => boolean | Promise<boolean>,
  options: PollingOptions = {},
): Promise<T> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const intervalMs = options.intervalMs ?? DEFAULT_INTERVAL_MS;
  const pollingName = options.pollingName ?? 'Polling condition';
  const failureMessage = options.failureMessage ?? `${pollingName} timeout exceeded`;

  const startTime = Date.now();
  let attempt = 0;
  let lastResult: T | undefined;
  let lastError: unknown;

  while (Date.now() - startTime <= timeoutMs) {
    attempt += 1;

    try {
      logger.debug(`${pollingName} - polling attempt ${attempt}`);

      const result = await action(attempt);
      lastResult = result;

      const isMatched = await condition(result);

      if (isMatched) {
        logger.info(`${pollingName} matched`, {
          attempt,
          elapsedMs: Date.now() - startTime,
        });

        return result;
      }
    } catch (error) {
      lastError = error;

      logger.warn(`${pollingName} attempt failed`, {
        attempt,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    await sleep(intervalMs);
  }

  logger.fail(failureMessage, {
    timeoutMs,
    intervalMs,
    attempts: attempt,
    lastError: lastError instanceof Error ? lastError.message : String(lastError ?? ''),
    lastResult,
  });

  throw new Error(failureMessage);
}
