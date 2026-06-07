import { test, expect } from '../../../src/fixtures/api.fixture';
import { createBookingData, partialUpdateBookingData } from '../../../src/data/booking.data';
import { expectStatus } from '../../../src/api/assertions/response.assertion';
import { createBookingResponseSchema, bookingSchema } from '../../../src/schemas/booking.schema';
import { generateAuthToken } from '../../../src/helpers/token.helper';
import { logger } from '../../../src/helpers/logger.helper';
import { retryAction, isRetryableApiResponse } from '../../../src/helpers/retry.helper';
import { waitUntil } from '../../../src/helpers/polling.helper';
import { cleanupBooking } from '../../../src/helpers/test-cleanup.helper';
import {
  addJsonAttachment,
  addAllureParameter,
  allureStep,
  setAllureApiMetadata,
  Severity,
} from '../../../src/helpers/allure.helper';

test.describe('[Booking API] Partial Update Booking', () => {
  let bookingIdForCleanup: number | undefined;
  let tokenForCleanup: string | undefined;

  test.afterEach(async ({ bookingService }) => {
    await cleanupBooking({
      bookingService,
      bookingId: bookingIdForCleanup,
      token: tokenForCleanup,
    });

    bookingIdForCleanup = undefined;
    tokenForCleanup = undefined;
  });

  test('BOOKING_PATCH_001 - should partially update booking firstname and lastname successfully', async ({
    authService,
    bookingService,
  }) => {
    await setAllureApiMetadata({
      epic: 'Booking Management API',
      feature: 'Booking API',
      story: 'Partial Update Booking',
      owner: 'trungtinle',
      severity: Severity.CRITICAL,
      tags: ['api', 'booking', 'patch', 'positive', 'regression', 'flaky-safe'],
      description:
        'Verify that user can partially update booking firstname and lastname successfully with valid auth token. Test includes retry, polling, and cleanup to reduce flaky risk.',
    });

    logger.testStart(
      'BOOKING_PATCH_001',
      'Partially update booking firstname and lastname successfully',
    );

    await addAllureParameter('endpoint', 'PATCH /booking/:id');
    await addAllureParameter('testType', 'Positive');
    await addAllureParameter('authType', 'Cookie token');
    await addAllureParameter('flakyProtection', 'retry + polling + cleanup');

    const token = await allureStep('Generate authentication token with retry', async () => {
      logger.step('Generate authentication token for PATCH booking');

      const authToken = await retryAction(() => generateAuthToken(authService), {
        retries: 2,
        delayMs: 750,
        retryName: 'Generate auth token',
      });

      tokenForCleanup = authToken;

      logger.info('Authentication token generated', {
        tokenGenerated: Boolean(authToken),
      });

      await addAllureParameter('tokenGenerated', Boolean(authToken));

      return authToken;
    });

    const createdBooking = await allureStep(
      'Create booking as test precondition with retry',
      async () => {
        logger.step('Create booking as precondition');

        logger.apiRequest('POST', '/booking', createBookingData);

        await addJsonAttachment('Create Booking Request Body', createBookingData);

        const createResponse = await retryAction(
          () => bookingService.createBooking(createBookingData),
          {
            retries: 2,
            delayMs: 750,
            retryName: 'Create booking precondition',
            retryOnResult: isRetryableApiResponse,
          },
        );

        await expectStatus(createResponse, 200);
        expect(createResponse.status()).toBe(200);

        const createBody = await createResponse.json();

        logger.apiResponse(createResponse.status(), 'POST /booking', createBody);

        await addJsonAttachment('Create Booking Response Body', createBody);

        const parsedBooking = createBookingResponseSchema.parse(createBody);

        bookingIdForCleanup = parsedBooking.bookingid;

        return parsedBooking;
      },
    );

    await addAllureParameter('bookingId', createdBooking.bookingid);

    logger.info('Booking created successfully', {
      bookingId: createdBooking.bookingid,
    });

    await allureStep('Wait until created booking is available via GET /booking/:id', async () => {
      const getResponse = await waitUntil(
        () =>
          retryAction(() => bookingService.getBooking(createdBooking.bookingid), {
            retries: 1,
            delayMs: 500,
            retryName: `Get created booking ${createdBooking.bookingid}`,
            retryOnResult: isRetryableApiResponse,
          }),
        (response) => response.status() === 200,
        {
          timeoutMs: 5_000,
          intervalMs: 500,
          pollingName: `Wait for booking ${createdBooking.bookingid}`,
          failureMessage: `Booking ${createdBooking.bookingid} was not available after creation`,
        },
      );

      logger.apiResponse(getResponse.status(), `/booking/${createdBooking.bookingid}`, {
        status: getResponse.status(),
      });

      expect(getResponse.status()).toBe(200);
    });

    const updatedBooking = await allureStep(
      'Send PATCH /booking/:id request with retry',
      async () => {
        const endpoint = `/booking/${createdBooking.bookingid}`;

        logger.step('Send partial update booking request', {
          bookingId: createdBooking.bookingid,
        });

        logger.apiRequest('PATCH', endpoint, partialUpdateBookingData);

        await addJsonAttachment('Partial Update Request Body', partialUpdateBookingData);

        const patchResponse = await retryAction(
          () =>
            bookingService.partialUpdateBooking(
              createdBooking.bookingid,
              partialUpdateBookingData,
              token,
            ),
          {
            retries: 2,
            delayMs: 750,
            retryName: `Partial update booking ${createdBooking.bookingid}`,
            retryOnResult: isRetryableApiResponse,
          },
        );

        await expectStatus(patchResponse, 200);
        expect(patchResponse.status()).toBe(200);

        const patchBody = await patchResponse.json();

        logger.apiResponse(patchResponse.status(), endpoint, patchBody);

        await addJsonAttachment('Partial Update Response Body', patchBody);

        return bookingSchema.parse(patchBody);
      },
    );

    await allureStep('Verify updated fields are changed correctly', async () => {
      logger.step('Verify updated fields', {
        expectedFirstname: partialUpdateBookingData.firstname,
        actualFirstname: updatedBooking.firstname,
        expectedLastname: partialUpdateBookingData.lastname,
        actualLastname: updatedBooking.lastname,
      });

      expect(updatedBooking.firstname).toBe(partialUpdateBookingData.firstname);
      expect(updatedBooking.lastname).toBe(partialUpdateBookingData.lastname);
    });

    await allureStep('Verify non-updated fields are kept unchanged', async () => {
      logger.step('Verify non-updated fields remain unchanged');

      expect(updatedBooking.totalprice).toBe(createBookingData.totalprice);
      expect(updatedBooking.depositpaid).toBe(createBookingData.depositpaid);
      expect(updatedBooking.bookingdates).toEqual(createBookingData.bookingdates);
    });

    logger.pass('BOOKING_PATCH_001', 'Partial update booking validated successfully');
    logger.testEnd('BOOKING_PATCH_001');
  });

  test('BOOKING_PATCH_002 - should not partially update booking without auth token', async ({
    authService,
    bookingService,
  }) => {
    await setAllureApiMetadata({
      epic: 'Booking Management API',
      feature: 'Booking API',
      story: 'Partial Update Booking - Unauthorized',
      owner: 'trungtinle',
      severity: Severity.NORMAL,
      tags: ['api', 'booking', 'patch', 'negative', 'security', 'flaky-safe'],
      description:
        'Verify that API rejects partial update booking request when authentication token is missing. Test includes retry, polling, and cleanup to reduce flaky risk.',
    });

    logger.testStart('BOOKING_PATCH_002', 'Partially update booking without auth token');

    await addAllureParameter('endpoint', 'PATCH /booking/:id');
    await addAllureParameter('testType', 'Negative');
    await addAllureParameter('authType', 'Missing token');
    await addAllureParameter('flakyProtection', 'retry + polling + cleanup');

    tokenForCleanup = await allureStep('Generate cleanup token with retry', async () => {
      const cleanupToken = await retryAction(() => generateAuthToken(authService), {
        retries: 2,
        delayMs: 750,
        retryName: 'Generate cleanup token',
      });

      logger.info('Cleanup token generated', {
        tokenGenerated: Boolean(cleanupToken),
      });

      return cleanupToken;
    });

    const createdBooking = await allureStep(
      'Create booking as test precondition with retry',
      async () => {
        logger.step('Create booking as precondition for unauthorized PATCH test');

        logger.apiRequest('POST', '/booking', createBookingData);

        await addJsonAttachment('Create Booking Request Body', createBookingData);

        const createResponse = await retryAction(
          () => bookingService.createBooking(createBookingData),
          {
            retries: 2,
            delayMs: 750,
            retryName: 'Create booking precondition for unauthorized PATCH test',
            retryOnResult: isRetryableApiResponse,
          },
        );

        await expectStatus(createResponse, 200);
        expect(createResponse.status()).toBe(200);

        const createBody = await createResponse.json();

        logger.apiResponse(createResponse.status(), 'POST /booking', createBody);

        await addJsonAttachment('Create Booking Response Body', createBody);

        const parsedBooking = createBookingResponseSchema.parse(createBody);

        bookingIdForCleanup = parsedBooking.bookingid;

        return parsedBooking;
      },
    );

    await addAllureParameter('bookingId', createdBooking.bookingid);

    logger.info('Booking created successfully for unauthorized PATCH test', {
      bookingId: createdBooking.bookingid,
    });

    await allureStep('Wait until created booking is available via GET /booking/:id', async () => {
      const getResponse = await waitUntil(
        () =>
          retryAction(() => bookingService.getBooking(createdBooking.bookingid), {
            retries: 1,
            delayMs: 500,
            retryName: `Get created booking ${createdBooking.bookingid}`,
            retryOnResult: isRetryableApiResponse,
          }),
        (response) => response.status() === 200,
        {
          timeoutMs: 5_000,
          intervalMs: 500,
          pollingName: `Wait for booking ${createdBooking.bookingid}`,
          failureMessage: `Booking ${createdBooking.bookingid} was not available after creation`,
        },
      );

      logger.apiResponse(getResponse.status(), `/booking/${createdBooking.bookingid}`, {
        status: getResponse.status(),
      });

      expect(getResponse.status()).toBe(200);
    });

    const patchResponse = await allureStep(
      'Send PATCH /booking/:id request without token',
      async () => {
        const endpoint = `/booking/${createdBooking.bookingid}`;

        logger.step('Send partial update request without auth token', {
          bookingId: createdBooking.bookingid,
        });

        logger.apiRequest('PATCH', endpoint, {
          ...partialUpdateBookingData,
          token: '',
        });

        await addJsonAttachment('Partial Update Request Body Without Token', {
          ...partialUpdateBookingData,
          token: '***masked***',
        });

        return bookingService.partialUpdateBooking(
          createdBooking.bookingid,
          partialUpdateBookingData,
          '',
        );
      },
    );

    await allureStep('Verify API rejects request with 403 Forbidden', async () => {
      logger.step('Verify unauthorized PATCH response status', {
        expectedStatus: 403,
        actualStatus: patchResponse.status(),
      });

      await expectStatus(patchResponse, 403);
      expect(patchResponse.status()).toBe(403);
    });

    await allureStep('Attach unauthorized response body if available', async () => {
      const text = await patchResponse.text();

      logger.apiResponse(patchResponse.status(), `/booking/${createdBooking.bookingid}`, {
        body: text,
      });

      await addJsonAttachment('Unauthorized Response', {
        status: patchResponse.status(),
        body: text,
      });
    });

    logger.pass('BOOKING_PATCH_002', 'Unauthorized partial update rejected successfully');
    logger.testEnd('BOOKING_PATCH_002');
  });
});
