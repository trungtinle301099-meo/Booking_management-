import { test, expect } from '../../../src/fixtures/api.fixture';
import { createBookingData, partialUpdateBookingData } from '../../../src/data/booking.data';
import { expectStatus } from '../../../src/api/assertions/response.assertion';
import { createBookingResponseSchema, bookingSchema } from '../../../src/schemas/booking.schema';
import { generateAuthToken } from '../../../src/helpers/token.helper';
import {
  addJsonAttachment,
  addAllureParameter,
  allureStep,
  setAllureApiMetadata,
  Severity,
} from '../../../src/helpers/allure.helper';

test.describe('[Booking API] Partial Update Booking', () => {
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
      tags: ['api', 'booking', 'patch', 'positive', 'regression'],
      description:
        'Verify that user can partially update booking firstname and lastname successfully with valid auth token.',
    });

    await addAllureParameter('endpoint', 'PATCH /booking/:id');
    await addAllureParameter('testType', 'Positive');
    await addAllureParameter('authType', 'Cookie token');

    const token = await allureStep('Generate authentication token', async () => {
      const authToken = await generateAuthToken(authService);
      await addAllureParameter('tokenGenerated', Boolean(authToken));
      return authToken;
    });

    const createdBooking = await allureStep('Create booking as test precondition', async () => {
      await addJsonAttachment('Create Booking Request Body', createBookingData);

      const createResponse = await bookingService.createBooking(createBookingData);

      await expectStatus(createResponse, 200);

      const createBody = await createResponse.json();
      await addJsonAttachment('Create Booking Response Body', createBody);

      return createBookingResponseSchema.parse(createBody);
    });

    await addAllureParameter('bookingId', createdBooking.bookingid);

    const updatedBooking = await allureStep('Send PATCH /booking/:id request', async () => {
      await addJsonAttachment('Partial Update Request Body', partialUpdateBookingData);

      const patchResponse = await bookingService.partialUpdateBooking(
        createdBooking.bookingid,
        partialUpdateBookingData,
        token,
      );

      await expectStatus(patchResponse, 200);

      const patchBody = await patchResponse.json();
      await addJsonAttachment('Partial Update Response Body', patchBody);

      return bookingSchema.parse(patchBody);
    });

    await allureStep('Verify updated fields are changed correctly', async () => {
      expect(updatedBooking.firstname).toBe(partialUpdateBookingData.firstname);
      expect(updatedBooking.lastname).toBe(partialUpdateBookingData.lastname);
    });

    await allureStep('Verify non-updated fields are kept unchanged', async () => {
      expect(updatedBooking.totalprice).toBe(createBookingData.totalprice);
      expect(updatedBooking.depositpaid).toBe(createBookingData.depositpaid);
      expect(updatedBooking.bookingdates).toEqual(createBookingData.bookingdates);
    });
  });

  test('BOOKING_PATCH_002 - should not partially update booking without auth token', async ({
    bookingService,
  }) => {
    await setAllureApiMetadata({
      epic: 'Booking Management API',
      feature: 'Booking API',
      story: 'Partial Update Booking - Unauthorized',
      owner: 'trungtinle',
      severity: Severity.NORMAL,
      tags: ['api', 'booking', 'patch', 'negative', 'security'],
      description:
        'Verify that API rejects partial update booking request when authentication token is missing.',
    });

    await addAllureParameter('endpoint', 'PATCH /booking/:id');
    await addAllureParameter('testType', 'Negative');
    await addAllureParameter('authType', 'Missing token');

    const createdBooking = await allureStep('Create booking as test precondition', async () => {
      await addJsonAttachment('Create Booking Request Body', createBookingData);

      const createResponse = await bookingService.createBooking(createBookingData);

      await expectStatus(createResponse, 200);

      const createBody = await createResponse.json();
      await addJsonAttachment('Create Booking Response Body', createBody);

      return createBookingResponseSchema.parse(createBody);
    });

    await addAllureParameter('bookingId', createdBooking.bookingid);

    const patchResponse = await allureStep(
      'Send PATCH /booking/:id request without token',
      async () => {
        await addJsonAttachment(
          'Partial Update Request Body Without Token',
          partialUpdateBookingData,
        );

        return bookingService.partialUpdateBooking(
          createdBooking.bookingid,
          partialUpdateBookingData,
          '',
        );
      },
    );

    await allureStep('Verify API rejects request with 403 Forbidden', async () => {
      await expectStatus(patchResponse, 403);
    });

    await allureStep('Attach unauthorized response body if available', async () => {
      const text = await patchResponse.text();
      await addJsonAttachment('Unauthorized Response', {
        status: patchResponse.status(),
        body: text,
      });
    });
  });
});
