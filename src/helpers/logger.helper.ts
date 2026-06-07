/* eslint-disable no-console */

/**
 * Logger utility for Playwright API tests.
 * Outputs colored logs to the console to track test execution easily.
 *
 * Usage:
 *   import { logger } from '../../../src/helpers/logger.helper';
 *
 *   logger.pass('LOGIN_API_001');
 *   logger.pass('LOGIN_API_001', 'Create token successfully');
 *   logger.step('Send POST /auth request');
 *   logger.info('Token is generated successfully');
 *   logger.fail('Expected status 200 but received 500');
 *   logger.setup('Prepare booking test data');
 */

// ANSI color codes
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

const timestamp = (): string => {
  return new Date().toISOString().replace('T', ' ').slice(0, 23);
};

const buildMessage = (testId: string, description?: string): string => {
  return description ? `${testId}: ${description}` : testId;
};

export const logger = {
  /**
   * Logs a passed test case.
   *
   * @param testId - Test case ID, e.g., 'LOGIN_API_001'
   * @param description - Short test description
   */
  pass(testId: string, description?: string): void {
    const message = buildMessage(testId, description);

    console.log(`${BOLD}${GREEN}[PASS] ${message}${RESET}  ${CYAN}(${timestamp()})${RESET}`);
  },

  /**
   * Logs general information during test execution.
   *
   * @param message - Information message
   */
  info(message: string): void {
    console.log(`${CYAN}[INFO] ${message}${RESET}`);
  },

  /**
   * Logs an execution step.
   *
   * @param message - Step message
   */
  step(message: string): void {
    console.log(`${YELLOW}[STEP] ${message}${RESET}`);
  },

  /**
   * Logs a failed step or assertion.
   *
   * @param message - Failure message
   */
  fail(message: string): void {
    console.log(`${RED}[FAIL] ${message}${RESET}`);
  },

  /**
   * Logs completion of setup or teardown block.
   *
   * @param message - Setup or teardown message
   */
  setup(message: string): void {
    console.log(`${BOLD}${YELLOW}[SETUP] ${message}${RESET}  ${CYAN}(${timestamp()})${RESET}`);
  },
};
