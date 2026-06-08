import { feature, story, severity, description } from 'allure-js-commons';
import { test, expect } from '../../../src/fixtures/api.fixture';
import { expectStatus } from '../../../src/api/assertions/response.assertion';
import { createBookingData } from '../../../src/data/booking.data';
import { generateAuthToken } from '../../../src/helpers/token.helper';
import {
  randomString,
  randomPrice,
  randomBookingDates,
  randomAdditionalNeeds,
} from '../../../src/helpers/random.helper';
import type { CreateBookingResponse } from '../../../src/types/booking.type';
import { logger } from '../../../src/helpers/logger.helper';

test.describe('[Booking API] Update Booking', () => {
  let bookingIdToUpdate: number | undefined;
  let authToken: string | undefined;

  test.beforeEach(async ({ bookingService, authService }) => {
    /**
     * Precondition Setup:
     * Step 1: Generate authentication token
     * Step 2: Create a booking for update test
     */

    // Step 1: Generate authentication token
    authToken = await generateAuthToken(authService);
    logger.info('Authentication token generated for update test');

    // Step 2: Create a booking
    const createResponse = await bookingService.createBooking(createBookingData);
    const createBody = (await createResponse.json()) as CreateBookingResponse;
    bookingIdToUpdate = createBody.bookingid;

    logger.info(`Booking created with ID: ${bookingIdToUpdate} for update test`);
  });

  test.afterEach(async ({ bookingService }) => {
    /**
     * Cleanup:
     * Delete the booking after test
     */
    if (bookingIdToUpdate && authToken) {
      await bookingService.deleteBooking(bookingIdToUpdate, authToken);
      logger.info(`Cleaned up booking with ID: ${bookingIdToUpdate}`);
    }
  });

  test('UPDATE_BOOKING_ID_001 - should update booking successfully with all fields', async ({
    bookingService,
  }) => {
    /**
     * Test Summary:
     * Step 1: Setup test metadata
     * Step 2: Prepare new booking data
     * Step 3: Call PUT /booking/:id API
     * Step 4: Check status code
     * Step 5: Verify all fields are updated
     * Step 6: Log test result
     */

    // Step 1: Setup test metadata
    await feature('Booking API');
    await story('Update Booking');
    await severity('critical');
    await description(
      'Verify that PUT /booking/:id updates all booking fields successfully with valid auth token.',
    );

    const { checkin: newCheckin, checkout: newCheckout } = randomBookingDates();

    // Step 2: Prepare new booking data
    const updatedBookingData = {
      firstname: randomString('UpdateFirstName'),
      lastname: randomString('UpdateLastName'),
      totalprice: randomPrice(100, 750),
      depositpaid: false,
      bookingdates: {
        checkin: newCheckin,
        checkout: newCheckout,
      },
      additionalneeds: randomAdditionalNeeds(),
    };

    logger.info(`Updating booking ${bookingIdToUpdate} with new data`);

    await test.step('Update booking with PUT request', async () => {
      // Step 3: Call PUT /booking/:id API
      const putResponse = await bookingService.updateBooking(
        bookingIdToUpdate!,
        updatedBookingData,
        authToken!,
      );

      const putBody = await putResponse.json();

      await test.info().attach('update-booking-request.json', {
        body: JSON.stringify(updatedBookingData, null, 2),
        contentType: 'application/json',
      });

      await test.info().attach('update-booking-response.json', {
        body: JSON.stringify(
          {
            status: putResponse.status(),
            bookingId: bookingIdToUpdate,
            responseBody: putBody,
          },
          null,
          2,
        ),
        contentType: 'application/json',
      });

      // Step 4: Check status code
      await expectStatus(putResponse, 200);
      expect(putResponse.status()).toBe(200);

      logger.info(`Booking ${bookingIdToUpdate} updated successfully`);

      // Step 5: Verify all fields are updated
      expect(putBody).toBeDefined();
      expect(putBody.firstname).toBe(updatedBookingData.firstname);
      expect(putBody.lastname).toBe(updatedBookingData.lastname);
      expect(putBody.totalprice).toBe(updatedBookingData.totalprice);
      expect(putBody.depositpaid).toBe(updatedBookingData.depositpaid);
      expect(putBody.bookingdates.checkin).toBe(updatedBookingData.bookingdates.checkin);
      expect(putBody.bookingdates.checkout).toBe(updatedBookingData.bookingdates.checkout);
      expect(putBody.additionalneeds).toBe(updatedBookingData.additionalneeds);

      logger.info('All booking fields verified successfully');

      // Step 6: Log test result
      logger.pass(
        `UPDATE_BOOKING_ID_001 - Booking ${bookingIdToUpdate} updated successfully with all fields`,
      );
    });
  });
});
