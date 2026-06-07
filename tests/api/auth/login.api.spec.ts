import { test, expect } from '../../../src/fixtures/api.fixture';
import { validAuthData, invalidAuthData } from '../../../src/data/auth.data';
import { expectStatus } from '../../../src/api/assertions/response.assertion';
import { createTokenResponseSchema } from '../../../src/schemas/booking.schema';
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

    await addAllureParameter('endpoint', 'POST /auth');
    await addAllureParameter('testType', 'Positive');
    await addAllureParameter(
      'baseUrl',
      process.env.BASE_URL || 'https://restful-booker.herokuapp.com',
    );

    const response = await allureStep(
      'Send POST /auth request with valid credentials',
      async () => {
        await addJsonAttachment('Auth Request Body', {
          username: validAuthData.username,
          password: '***masked***',
        });

        return authService.createToken(validAuthData);
      },
    );

    await allureStep('Verify response status is 200', async () => {
      await expectStatus(response, 200);
    });

    const body = await allureStep('Parse response body', async () => {
      const responseBody = await response.json();
      await addJsonAttachment('Auth Response Body', responseBody);
      return responseBody;
    });

    await allureStep('Validate response schema and token value', async () => {
      const parsed = createTokenResponseSchema.parse(body);
      expect(parsed.token).toBeTruthy();
    });
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

    await addAllureParameter('endpoint', 'POST /auth');
    await addAllureParameter('testType', 'Negative');

    const response = await allureStep(
      'Send POST /auth request with invalid credentials',
      async () => {
        await addJsonAttachment('Invalid Auth Request Body', {
          username: invalidAuthData.username,
          password: '***masked***',
        });

        return authService.createToken(invalidAuthData);
      },
    );

    await allureStep('Verify response status is 200 with error reason', async () => {
      await expectStatus(response, 200);
    });

    const body = await allureStep('Parse error response body', async () => {
      const responseBody = await response.json();
      await addJsonAttachment('Invalid Auth Response Body', responseBody);
      return responseBody;
    });

    await allureStep('Validate bad credential response', async () => {
      expect(body).toHaveProperty('reason');
      expect(body.reason).toBe('Bad credentials');
    });
  });
});
