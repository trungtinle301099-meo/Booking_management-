export type ApiFlakyConfig = {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  transientStatusCodes: number[];
  transientErrorKeywords: string[];
  enableDebugLog: boolean;
};

export const apiFlakyConfig: ApiFlakyConfig = {
  /**
   * Số lần retry ngầm khi gặp lỗi transient.
   * maxRetries = 2 nghĩa là:
   * - lần 1: request gốc
   * - lần 2: retry 1
   * - lần 3: retry 2
   */
  maxRetries: process.env.CI ? 2 : 1,

  /**
   * Delay ban đầu trước khi retry.
   */
  baseDelayMs: 300,

  /**
   * Giới hạn delay tối đa để tránh test chạy quá lâu.
   */
  maxDelayMs: 2000,

  /**
   * Chỉ retry các HTTP status có khả năng là lỗi tạm thời.
   * Không retry 400/401/403/404 vì đó thường là lỗi business/test thật.
   */
  transientStatusCodes: [408, 429, 500, 502, 503, 504],

  /**
   * Retry các lỗi network tạm thời.
   */
  transientErrorKeywords: [
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
    'EAI_AGAIN',
    'socket hang up',
    'network',
    'timeout',
  ],

  /**
   * Bật log retry khi cần debug.
   * Mặc định false để test output không bị rối.
   */
  enableDebugLog: process.env.API_FLAKY_DEBUG === 'true',
};
