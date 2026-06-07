import { ContentType } from 'allure-js-commons';
import * as allure from 'allure-js-commons';

type LogLevel =
  | 'INFO'
  | 'STEP'
  | 'PASS'
  | 'FAIL'
  | 'WARN'
  | 'SETUP'
  | 'DEBUG'
  | 'REQUEST'
  | 'RESPONSE';

type LogPayload =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null
  | undefined;

const ANSI = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
} as const;

const SENSITIVE_KEYS = [
  'password',
  'token',
  'cookie',
  'authorization',
  'auth',
  'accessToken',
  'refreshToken',
  'BOOKING_PASSWORD',
];

function isColorEnabled(): boolean {
  return process.env.NO_COLOR !== 'true';
}

function shouldAttachToAllure(): boolean {
  return process.env.ALLURE_LOG_ATTACHMENTS !== 'false';
}

function timestamp(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 23);
}

function colorize(message: string, color: keyof typeof ANSI): string {
  if (!isColorEnabled()) {
    return message;
  }

  return `${ANSI[color]}${message}${ANSI.reset}`;
}

function bold(message: string): string {
  if (!isColorEnabled()) {
    return message;
  }

  return `${ANSI.bold}${message}${ANSI.reset}`;
}

function maskSensitiveValue(key: string, value: unknown): unknown {
  const isSensitiveKey = SENSITIVE_KEYS.some(
    (sensitiveKey) => sensitiveKey.toLowerCase() === key.toLowerCase(),
  );

  if (isSensitiveKey) {
    return '***masked***';
  }

  return value;
}

function sanitizePayload(payload: LogPayload): unknown {
  if (payload === null || payload === undefined) {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizePayload(item as LogPayload));
  }

  if (typeof payload === 'object') {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
      if (value && typeof value === 'object') {
        sanitized[key] = sanitizePayload(maskSensitiveValue(key, value) as LogPayload);
      } else {
        sanitized[key] = maskSensitiveValue(key, value);
      }
    }

    return sanitized;
  }

  return payload;
}

function stringifyPayload(payload?: LogPayload): string {
  if (payload === undefined) {
    return '';
  }

  const sanitizedPayload = sanitizePayload(payload);

  if (typeof sanitizedPayload === 'string') {
    return sanitizedPayload;
  }

  try {
    return JSON.stringify(sanitizedPayload, null, 2);
  } catch {
    return String(sanitizedPayload);
  }
}

function writeTerminalLog(level: LogLevel, message: string, payload?: LogPayload): void {
  const levelColorMap: Record<LogLevel, keyof typeof ANSI> = {
    INFO: 'cyan',
    STEP: 'yellow',
    PASS: 'green',
    FAIL: 'red',
    WARN: 'yellow',
    SETUP: 'magenta',
    DEBUG: 'gray',
    REQUEST: 'blue',
    RESPONSE: 'cyan',
  };

  const label = colorize(`[${level}]`, levelColorMap[level]);
  const time = colorize(`(${timestamp()})`, 'gray');
  const title = `${label} ${message} ${time}`;
  const detail = stringifyPayload(payload);
  const output = detail ? `${title}\n${detail}\n` : `${title}\n`;

  if (level === 'FAIL' || level === 'WARN') {
    process.stderr.write(output);
    return;
  }

  process.stdout.write(output);
}

function attachAllureTextLog(level: LogLevel, message: string, payload?: LogPayload): void {
  if (!shouldAttachToAllure()) {
    return;
  }

  const detail = stringifyPayload(payload);

  const content = [
    `Level: ${level}`,
    `Time: ${timestamp()}`,
    `Message: ${message}`,
    detail ? `Payload:\n${detail}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  void allure.attachment(`${level} - ${message}`, content, ContentType.TEXT);
}

function attachAllureJsonLog(name: string, payload?: LogPayload): void {
  if (!shouldAttachToAllure() || payload === undefined) {
    return;
  }

  const sanitizedPayload = sanitizePayload(payload);

  try {
    void allure.attachment(name, JSON.stringify(sanitizedPayload, null, 2), ContentType.JSON);
  } catch {
    void allure.attachment(name, String(sanitizedPayload), ContentType.TEXT);
  }
}

function log(level: LogLevel, message: string, payload?: LogPayload): void {
  writeTerminalLog(level, message, payload);
  attachAllureTextLog(level, message, payload);
}

export const logger = {
  testStart(testId: string, description?: string): void {
    const message = description ? `${testId}: ${description}` : testId;
    log('SETUP', bold(`START ${message}`));
  },

  testEnd(testId: string, description?: string): void {
    const message = description ? `${testId}: ${description}` : testId;
    log('SETUP', bold(`END ${message}`));
  },

  pass(testId: string, description?: string): void {
    const message = description ? `${testId}: ${description}` : testId;
    log('PASS', bold(message));
  },

  info(message: string, payload?: LogPayload): void {
    log('INFO', message, payload);
  },

  step(message: string, payload?: LogPayload): void {
    log('STEP', message, payload);
  },

  warn(message: string, payload?: LogPayload): void {
    log('WARN', message, payload);
  },

  fail(message: string, payload?: LogPayload): void {
    log('FAIL', message, payload);
  },

  setup(message: string, payload?: LogPayload): void {
    log('SETUP', message, payload);
  },

  debug(message: string, payload?: LogPayload): void {
    if (process.env.DEBUG_LOG === 'true') {
      log('DEBUG', message, payload);
    }
  },

  apiRequest(method: string, endpoint: string, payload?: LogPayload): void {
    const message = `${method.toUpperCase()} ${endpoint}`;

    log('REQUEST', message, payload);
    attachAllureJsonLog(`API Request - ${message}`, payload);
  },

  apiResponse(status: number, endpoint: string, payload?: LogPayload): void {
    const message = `${status} ${endpoint}`;

    log('RESPONSE', message, payload);
    attachAllureJsonLog(`API Response - ${message}`, payload);
  },
};
