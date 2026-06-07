import { test, expect } from '../../../src/fixtures/api.fixture';
import { validAuthData, invalidAuthData } from '../../../src/data/auth.data';
import { expectStatus } from '../../../src/api/assertions/response.assertion';
import { createTokenResponseSchema } from '../../../src/schemas/booking.schema';

test.describe('[Auth API] Create Token', () => {
  test('should create token successfully with valid credential', async ({ authService }) => {
    const response = await authService.createToken(validAuthData);

    await expectStatus(response, 200);

    const body = await response.json();
    const parsed = createTokenResponseSchema.parse(body);

    expect(parsed.token).toBeTruthy();
  });

  test('should not create valid token with invalid credential', async ({ authService }) => {
    const response = await authService.createToken(invalidAuthData);

    await expectStatus(response, 200);

    const body = await response.json();

    expect(body).toHaveProperty('reason');
    expect(body.reason).toBe('Bad credentials');
  });
});
