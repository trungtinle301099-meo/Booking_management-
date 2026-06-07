import type { APIResponse } from '@playwright/test';
import { logger } from './logger.helper';

export type RetryContext<T> = {
  attempt: number;
  result?: T;
  error?: unknown;
};

export type RetryOptions<T> = {
  retries?: number;
  delayMs?: number;
  retryName?: string;
  retryOnError?: (error: unknown) => boolean;
  retryOnResult?: (result: T) => boolean | Promise<boolean>;
};

const DEFAULT_RETRIES = 2;
const DEFAULT_DELAY_MS = 750;

const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

function sleep(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export function isRetryableApiStatus(status: number): boolean {
  return RETRYABLE_STATUS_CODES.includes(status);
}

export function isRetryableApiResponse(response: APIResponse): boolean {
  return isRetryableApiStatus(response.status());
}

export function isRetryableNetworkError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();

  return [
    'timeout',
    'econnreset',
    'econnrefused',
    'enotfound',
    'socket',
    'network',
    'fetch failed',
    'service unavailable',
    'gateway',
  ].some((keyword) => message.includes(keyword));
}

export async function retryAction<T>(
  action: (attempt: number) => Promise<T>,
  options: RetryOptions<T> = {},
): Promise<T> {
  const retries = options.retries ?? DEFAULT_RETRIES;
  const delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
  const retryName = options.retryName ?? 'Retry action';
  const retryOnError = options.retryOnError ?? isRetryableNetworkError;
  const retryOnResult = options.retryOnResult;

  let lastError: unknown;
  let lastResult: T | undefined;

  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    try {
      logger.debug(`${retryName} - attempt ${attempt}`);

      const result = await action(attempt);
      lastResult = result;

      const shouldRetryResult = retryOnResult ? await retryOnResult(result) : false;

      if (!shouldRetryResult) {
        if (attempt > 1) {
          logger.info(`${retryName} succeeded after retry`, {
            attempt,
          });
        }

        return result;
      }

      if (attempt > retries) {
        logger.warn(`${retryName} returned retryable result but retry limit reached`, {
          attempt,
          retries,
        });

        return result;
      }

      logger.warn(`${retryName} returned retryable result, retrying`, {
        attempt,
        retries,
        delayMs,
      });

      await sleep(delayMs);
    } catch (error) {
      lastError = error;

      if (attempt > retries || !retryOnError(error)) {
        logger.fail(`${retryName} failed and will not retry`, {
          attempt,
          retries,
          error: getErrorMessage(error),
        });

        throw error;
      }

      logger.warn(`${retryName} failed with retryable error, retrying`, {
        attempt,
        retries,
        delayMs,
        error: getErrorMessage(error),
      });

      await sleep(delayMs);
    }
  }

  if (lastError) {
    throw lastError;
  }

  if (lastResult !== undefined) {
    return lastResult;
  }

  throw new Error(`${retryName} failed without result or error`);
}
