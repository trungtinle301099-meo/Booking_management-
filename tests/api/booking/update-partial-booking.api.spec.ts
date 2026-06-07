import { feature, story, severity, description } from 'allure-js-commons';
import { test, expect } from '../../../src/fixtures/api.fixture';
import { createBookingData, partialUpdateBookingData } from '../../../src/data/booking.data';
import { expectStatus } from '../../../src/api/assertions/response.assertion';
import { createBookingResponseSchema, bookingSchema } from '../../../src/schemas/booking.schema';
import { generateAuthToken } from '../../../src/helpers/token.helper';

test.describe('[Booking API] Partial Update Booking', () => {
  let bookingId: number;

  test.beforeEach(async ({ bookingService }) => {
    const createResponse = await bookingService.createBooking(createBookingData);

    await expectStatus(createResponse, 200);
    expect(createResponse.status()).toBe(200);

    const createBody = await createResponse.json();
    const createdBooking = createBookingResponseSchema.parse(createBody);

    bookingId = createdBooking.bookingid;
  });

  test('should partially update booking firstname and lastname successfully', async ({
    authService,
    bookingService,
  }) => {
    await feature('Update Booking');
    await story('Partially update booking information with valid auth token');
    await severity('critical');
    await description(
      'This test verifies that a booking can be partially updated with valid authentication. It checks that the firstname and lastname fields are updated while other fields remain unchanged.',
    );

    const token = await generateAuthToken(authService);

    const patchResponse = await bookingService.partialUpdateBooking(
      bookingId,
      partialUpdateBookingData,
      token,
    );

    await expectStatus(patchResponse, 200);
    expect(patchResponse.status()).toBe(200);

    const patchBody = await patchResponse.json();
    const updatedBooking = bookingSchema.parse(patchBody);

    expect(updatedBooking.firstname).toBe(partialUpdateBookingData.firstname);
    expect(updatedBooking.lastname).toBe(partialUpdateBookingData.lastname);
    expect(updatedBooking.totalprice).toBe(createBookingData.totalprice);
    expect(updatedBooking.depositpaid).toBe(createBookingData.depositpaid);
    expect(updatedBooking.bookingdates).toEqual(createBookingData.bookingdates);
  });

  test('should not partially update booking without auth token', async ({ bookingService }) => {
    await feature('Update Booking');
    await story('Attempt to partially update booking information without auth token');
    await severity('critical');
    await description(
      'This test verifies that a booking cannot be partially updated without providing an authentication token. It checks that the API returns a 403 Forbidden status.',
    );
    const patchResponse = await bookingService.partialUpdateBooking(
      bookingId,
      partialUpdateBookingData,
      '',
    );

    await expectStatus(patchResponse, 403);
    expect(patchResponse.status()).toBe(403);
  });
});
