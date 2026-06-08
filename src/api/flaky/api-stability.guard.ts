import type { APIResponse } from '@playwright/test';
import { apiFlakyConfig } from './api-flaky.config';

type ApiCall = () => Promise<APIResponse>;

type ApiStabilityGuardOptions = {
  method: string;
  url: string;
};

const sleep = async (delayMs: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
};

const calculateDelay = (attempt: number): number => {
  const exponentialDelay = apiFlakyConfig.baseDelayMs * 2 ** attempt;
  const jitter = Math.floor(Math.random() * 100);

  return Math.min(exponentialDelay + jitter, apiFlakyConfig.maxDelayMs);
};

const isTransientStatusCode = (statusCode: number): boolean => {
  return apiFlakyConfig.transientStatusCodes.includes(statusCode);
};

const isTransientError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error);

  return apiFlakyConfig.transientErrorKeywords.some((keyword) =>
    message.toLowerCase().includes(keyword.toLowerCase()),
  );
};

const logRetry = (message: string): void => {
  if (apiFlakyConfig.enableDebugLog) {
    // Only log when API_FLAKY_DEBUG=true to avoid noisy test output.
    // eslint-disable-next-line no-console
    console.warn(message);
  }
};

export const apiStabilityGuard = {
  async run(apiCall: ApiCall, options: ApiStabilityGuardOptions): Promise<APIResponse> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= apiFlakyConfig.maxRetries; attempt += 1) {
      try {
        const response = await apiCall();
        const statusCode = response.status();

        if (!isTransientStatusCode(statusCode)) {
          return response;
        }

        if (attempt === apiFlakyConfig.maxRetries) {
          return response;
        }

        const delayMs = calculateDelay(attempt);

        logRetry(
          `[API flaky guard] Retry ${attempt + 1}/${apiFlakyConfig.maxRetries} - ${options.method} ${options.url} returned ${statusCode}. Waiting ${delayMs}ms...`,
        );

        await response.dispose();
        await sleep(delayMs);
      } catch (error) {
        lastError = error;

        if (!isTransientError(error) || attempt === apiFlakyConfig.maxRetries) {
          throw error;
        }

        const delayMs = calculateDelay(attempt);

        logRetry(
          `[API flaky guard] Retry ${attempt + 1}/${apiFlakyConfig.maxRetries} - ${options.method} ${options.url} failed with transient error. Waiting ${delayMs}ms...`,
        );

        await sleep(delayMs);
      }
    }

    throw lastError;
  },
};
