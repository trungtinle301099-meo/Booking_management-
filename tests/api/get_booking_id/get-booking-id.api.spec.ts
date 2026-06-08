import { feature, story, severity, description } from 'allure-js-commons';
import { test, expect } from '../../../src/fixtures/api.fixture';
import { expectStatus } from '../../../src/api/assertions/response.assertion';
import { logger } from '../../../src/helpers/logger.helper';
import type { BookingIdResponse } from '../../../src/types/booking.type';

test.describe('[Booking API] Get Booking IDs', () => {
  test('GET_BOOKING_ID_001 - should display all booking ids successfully', async ({
    bookingService,
  }) => {
    /**
     * Test Summary:
     * Step 1: Setup test metadata
     * Step 2: Call GET /booking API
     * Step 3: Check status code
     * Step 4: Check response body
     * Step 5: Check booking id data
     * Step 6: Log test result
     */

    // Step 1: Setup test metadata
    await feature('Booking API');
    await story('Get Booking IDs');
    await severity('critical');
    await description(
      'Verify that GET /booking returns status 200 and response contains bookingid list.',
    );

    await test.step('Call GET /booking through booking service', async () => {
      // Step 2: Call GET /booking API
      const response = await bookingService.getBookingIds();
      const body = (await response.json()) as BookingIdResponse[];
      const totalBookingIds = body.length;

      await test.info().attach('get-booking-ids-response.json', {
        body: JSON.stringify(
          {
            status: response.status(),
            totalBookingIds,
            responseBody: body,
          },
          null,
          2,
        ),
        contentType: 'application/json',
      });

      // Step 3: Check status code
      await expectStatus(response, 200);
      expect(response.status()).toBe(200);

      // Step 4: Check response body
      expect(Array.isArray(body)).toBeTruthy();
      expect(body.length).toBeGreaterThan(0);

      logger.info(`GET_BOOKING_ID_001 - Total booking IDs: ${totalBookingIds}`);

      // Step 5: Check booking id data
      for (const booking of body) {
        expect(booking).toHaveProperty('bookingid');
        expect(typeof booking.bookingid).toBe('number');
        expect(booking.bookingid).toBeGreaterThan(0);
      }

      // Step 6: Log test result
      logger.pass('GET_BOOKING_ID_001');
    });
  });
});
