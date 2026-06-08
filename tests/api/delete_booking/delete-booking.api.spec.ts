import { feature, story, severity, description } from 'allure-js-commons';
import { test, expect } from '../../../src/fixtures/api.fixture';
import { expectStatus } from '../../../src/api/assertions/response.assertion';
import { createBookingData } from '../../../src/data/booking.data';
import { generateAuthToken } from '../../../src/helpers/token.helper';
import type { CreateBookingResponse } from '../../../src/types/booking.type';
import { logger } from '../../../src/helpers/logger.helper';

test.describe('[Booking API] Delete Booking', () => {
  let bookingIdToDelete: number | undefined;
  let authToken: string | undefined;

  test.beforeEach(async ({ bookingService, authService }) => {
    /**
     * Precondition Setup:
     * Step 1: Generate authentication token
     * Step 2: Create a booking for deletion test
     */

    // Step 1: Generate authentication token
    authToken = await generateAuthToken(authService);
    logger.info('Authentication token generated for delete test');

    // Step 2: Create a booking
    const createResponse = await bookingService.createBooking(createBookingData);
    const createBody = (await createResponse.json()) as CreateBookingResponse;
    bookingIdToDelete = createBody.bookingid;

    logger.info(`Booking created with ID: ${bookingIdToDelete} for deletion test`);
  });

  test('DELETE_BOOKING_ID_001 - should delete booking successfully', async ({ bookingService }) => {
    /**
     * Test Summary:
     * Step 1: Setup test metadata
     * Step 2: Call DELETE /booking/:id API
     * Step 3: Check status code
     * Step 4: Verify booking is deleted
     * Step 5: Log test result
     */

    // Step 1: Setup test metadata
    await feature('Booking API');
    await story('Delete Booking');
    await severity('critical');
    await description(
      'Verify that DELETE /booking/:id deletes a booking successfully with valid auth token.',
    );

    await test.step('Delete booking and verify deletion', async () => {
      logger.info(`Deleting booking with ID: ${bookingIdToDelete}`);

      // Step 2: Call DELETE /booking/:id API
      const deleteResponse = await bookingService.deleteBooking(bookingIdToDelete!, authToken!);

      await test.info().attach('delete-booking-response.json', {
        body: JSON.stringify(
          {
            status: deleteResponse.status(),
            bookingId: bookingIdToDelete,
            deleted: true,
          },
          null,
          2,
        ),
        contentType: 'application/json',
      });

      // Step 3: Check status code
      await expectStatus(deleteResponse, 204);
      expect(deleteResponse.status()).toBe(204);

      logger.info(`Booking ${bookingIdToDelete} deleted successfully`);

      // Step 4: Verify booking is deleted by attempting to get it
      const getResponse = await bookingService.getBooking(bookingIdToDelete!);

      await test.info().attach('verify-deleted-booking.json', {
        body: JSON.stringify(
          {
            status: getResponse.status(),
            bookingId: bookingIdToDelete,
            message: 'Attempting to fetch deleted booking',
          },
          null,
          2,
        ),
        contentType: 'application/json',
      });

      expect(getResponse.status()).toBe(404);

      logger.info(`Verified: Booking ${bookingIdToDelete} is no longer accessible (404 Not Found)`);

      // Step 5: Log test result
      logger.pass(`DELETE_BOOKING_ID_001 - Booking ${bookingIdToDelete} deleted successfully`);
    });
  });
});
