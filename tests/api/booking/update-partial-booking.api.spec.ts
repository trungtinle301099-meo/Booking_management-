import { test, expect } from '../../../src/fixtures/api.fixture';
import { createBookingData, partialUpdateBookingData } from '../../../src/data/booking.data';
import { expectStatus } from '../../../src/api/assertions/response.assertion';
import { createBookingResponseSchema, bookingSchema } from '../../../src/schemas/booking.schema';
import { generateAuthToken } from '../../../src/helpers/token.helper';

test.describe('[Booking API] Partial Update Booking', () => {
  test('should partially update booking firstname and lastname successfully', async ({
    authService,
    bookingService,
  }) => {
    const token = await generateAuthToken(authService);

    const createResponse = await bookingService.createBooking(createBookingData);
    await expectStatus(createResponse, 200);

    const createBody = await createResponse.json();
    const createdBooking = createBookingResponseSchema.parse(createBody);

    const patchResponse = await bookingService.partialUpdateBooking(
      createdBooking.bookingid,
      partialUpdateBookingData,
      token,
    );

    await expectStatus(patchResponse, 200);

    const patchBody = await patchResponse.json();
    const updatedBooking = bookingSchema.parse(patchBody);

    expect(updatedBooking.firstname).toBe(partialUpdateBookingData.firstname);
    expect(updatedBooking.lastname).toBe(partialUpdateBookingData.lastname);
    expect(updatedBooking.totalprice).toBe(createBookingData.totalprice);
    expect(updatedBooking.depositpaid).toBe(createBookingData.depositpaid);
    expect(updatedBooking.bookingdates).toEqual(createBookingData.bookingdates);
  });

  test('should not partially update booking without auth token', async ({ bookingService }) => {
    const createResponse = await bookingService.createBooking(createBookingData);
    await expectStatus(createResponse, 200);

    const createBody = await createResponse.json();
    const createdBooking = createBookingResponseSchema.parse(createBody);

    const patchResponse = await bookingService.partialUpdateBooking(
      createdBooking.bookingid,
      partialUpdateBookingData,
      '',
    );

    await expectStatus(patchResponse, 403);
  });
});
