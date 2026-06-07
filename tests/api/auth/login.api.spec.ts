import { test, expect } from '../../../src/fixtures/api.fixture';
import { validAuthData, invalidAuthData } from '../../../src/data/auth.data';
import { expectStatus } from '../../../src/api/assertions/response.assertion';
import { createTokenResponseSchema } from '../../../src/schemas/booking.schema';
import { logger } from '../../../src/helpers/logger.helper';
import {
  addJsonAttachment,
  addAllureParameter,
  allureStep,
  setAllureApiMetadata,
  Severity,
} from '../../../src/helpers/allure.helper';

test.describe('[Auth API] Create Token', () => {
  test('AUTH_001 - should create token successfully with valid credential', async ({
    authService,
  }) => {
    await setAllureApiMetadata({
      epic: 'Booking Management API',
      feature: 'Auth API',
      story: 'Create Token',
      owner: 'trungtinle',
      severity: Severity.CRITICAL,
      tags: ['api', 'auth', 'positive', 'smoke'],
      description:
        'Verify that user can create authentication token successfully using valid username and password.',
    });

    logger.testStart('AUTH_001', 'Create token successfully with valid credential');

    await addAllureParameter('endpoint', 'POST /auth');
    await addAllureParameter('testType', 'Positive');
    await addAllureParameter(
      'baseUrl',
      process.env.BASE_URL || 'https://restful-booker.herokuapp.com',
    );

    const response = await allureStep(
      'Send POST /auth request with valid credentials',
      async () => {
        logger.step('Preparing valid auth request data');

        logger.apiRequest('POST', '/auth', {
          username: validAuthData.username,
          password: validAuthData.password,
        });

        await addJsonAttachment('Auth Request Body', {
          username: validAuthData.username,
          password: '***masked***',
        });

        return authService.createToken(validAuthData);
      },
    );

    await allureStep('Verify response status is 200', async () => {
      logger.step('Verify auth response status', {
        expectedStatus: 200,
        actualStatus: response.status(),
      });

      await expectStatus(response, 200);
      expect(response.status()).toBe(200);
    });

    const body = await allureStep('Parse response body', async () => {
      const responseBody = await response.json();

      logger.apiResponse(response.status(), 'POST /auth', responseBody);

      await addJsonAttachment('Auth Response Body', responseBody);

      return responseBody;
    });

    await allureStep('Validate response schema and token value', async () => {
      logger.step('Validate token response schema');

      const parsed = createTokenResponseSchema.parse(body);

      expect(parsed.token).toBeTruthy();
    });

    logger.pass('AUTH_001', 'Token created successfully');
    logger.testEnd('AUTH_001');
  });

  test('AUTH_002 - should not create valid token with invalid credential', async ({
    authService,
  }) => {
    await setAllureApiMetadata({
      epic: 'Booking Management API',
      feature: 'Auth API',
      story: 'Create Token - Invalid Credentials',
      owner: 'trungtinle',
      severity: Severity.NORMAL,
      tags: ['api', 'auth', 'negative', 'security'],
      description:
        'Verify that API does not create a valid token when username and password are invalid.',
    });

    logger.testStart('AUTH_002', 'Create token with invalid credential');

    await addAllureParameter('endpoint', 'POST /auth');
    await addAllureParameter('testType', 'Negative');

    const response = await allureStep(
      'Send POST /auth request with invalid credentials',
      async () => {
        logger.step('Preparing invalid auth request data');

        logger.apiRequest('POST', '/auth', {
          username: invalidAuthData.username,
          password: invalidAuthData.password,
        });

        await addJsonAttachment('Invalid Auth Request Body', {
          username: invalidAuthData.username,
          password: '***masked***',
        });

        return authService.createToken(invalidAuthData);
      },
    );

    await allureStep('Verify response status is 200 with error reason', async () => {
      logger.step('Verify invalid auth response status', {
        expectedStatus: 200,
        actualStatus: response.status(),
      });

      await expectStatus(response, 200);
      expect(response.status()).toBe(200);
    });

    const body = await allureStep('Parse error response body', async () => {
      const responseBody = await response.json();

      logger.apiResponse(response.status(), 'POST /auth', responseBody);

      await addJsonAttachment('Invalid Auth Response Body', responseBody);

      return responseBody;
    });

    await allureStep('Validate bad credential response', async () => {
      logger.step('Validate bad credential response body');

      expect(body).toHaveProperty('reason');
      expect(body.reason).toBe('Bad credentials');
    });

    logger.pass('AUTH_002', 'Bad credential response validated successfully');
    logger.testEnd('AUTH_002');
  });
});
