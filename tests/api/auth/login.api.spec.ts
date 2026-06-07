import { test, expect } from '../../../src/fixtures/api.fixture';
import { validAuthData, invalidAuthData } from '../../../src/data/auth.data';
import { expectStatus } from '../../../src/api/assertions/response.assertion';
import { createTokenResponseSchema } from '../../../src/schemas/booking.schema';
import { feature, story, severity, description } from 'allure-js-commons';

test.describe('[Auth API] Create Token', () => {
  test('should create token successfully with valid credential', async ({ authService }) => {
    await feature('Create Token');
    await story('Create token with valid credentials');
    await severity('critical');
    await description(
      'This test verifies that a token can be created successfully with valid authentication credentials.',
    );
    const response = await authService.createToken(validAuthData);

    await expectStatus(response, 200);

    const body = await response.json();
    const parsed = createTokenResponseSchema.parse(body);

    expect(parsed.token).toBeTruthy();
  });

  test('should not create valid token with invalid credential', async ({ authService }) => {
    await feature('Create Token');
    await story('Attempt to create token with invalid credentials');
    await severity('critical');
    await description(
      'This test verifies that a token cannot be created with invalid authentication credentials. It checks that the API returns a 403 Forbidden status.',
    );
    const response = await authService.createToken(invalidAuthData);

    await expectStatus(response, 200);

    const body = await response.json();

    expect(body).toHaveProperty('reason');
    expect(body.reason).toBe('Bad credentials');
  });
});
