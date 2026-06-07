import { feature, story, severity, description } from 'allure-js-commons';
import { expectStatus } from '../../../src/api/assertions/response.assertion';
import { createBookingData } from '../../../src/data/booking.data';
import { test, expect } from '../../../src/fixtures/api.fixture';
import { generateAuthToken } from '../../../src/helpers/token.helper';
import type { BookingIdResponse, CreateBookingResponse } from '../../../src/types/booking.type';
import { logger } from '@/helpers/logger.helper';

test.describe('[Booking API] Create Booking', () => {
  let createdBookingId: number | undefined;

  test.afterEach(async ({ bookingService, authService }) => {
    // Step cleanup: Generate token only when cleanup is needed
    if (createdBookingId) {
      const token = await generateAuthToken(authService);

      await bookingService.deleteBooking(createdBookingId, token);
      createdBookingId = undefined;
    
      logger.info(`Cleaned up created booking with ID: ${createdBookingId}`);
    }
  });

test('CREATE_BOOKING_ID_001 - should create booking successfully with valid required and optional fields', async ({
  bookingService,
    }) => {
        /**
         * Test Summary:
         * Step 1: Setup test metadata
         * Step 2: Call POST /booking API
         * Step 3: Parse response body
         * Step 4: Save booking id for cleanup
         * Step 5: Check status code
         * Step 6: Check response body
         * Step 7: Check booking id data
         * Step 8: Check booking object data
         * Step 9: Log test result
         */

        // Step 1: Setup test metadata
        await feature('Booking API');
        await story('Create Booking');
        await severity('critical');
        await description(
            'Verify that POST /booking creates a booking successfully with valid required and optional fields.'
        );

        // Step 2: Call POST /booking API
        const response = await bookingService.createBooking(createBookingData);

        // Step 3: Parse response body
        const body = (await response.json()) as CreateBookingResponse;

        // Step 4: Save booking id for cleanup
        createdBookingId = body.bookingid;

        // Step 5: Check status code
        await expectStatus(response, 200);
        expect(response.status()).toBe(200);

        // Step 6: Check response body
        expect(body).toBeDefined();
        expect(Array.isArray(body)).toBeFalsy();

        // Step 7: Check booking id data
        expect(body).toHaveProperty('bookingid');
        expect(typeof body.bookingid).toBe('number');
        expect(body.bookingid).toBeGreaterThan(0);

        // Step 8: Check booking object data
        expect(body).toHaveProperty('booking');
        expect(body.booking).toBeDefined();
        expect(body.booking.firstname).toBe(createBookingData.firstname);
        expect(body.booking.lastname).toBe(createBookingData.lastname);
        expect(body.booking.totalprice).toBe(createBookingData.totalprice);
        expect(body.booking.depositpaid).toBe(createBookingData.depositpaid);
        expect(body.booking.bookingdates.checkin).toBe(
            createBookingData.bookingdates.checkin
        );
        expect(body.booking.bookingdates.checkout).toBe(
            createBookingData.bookingdates.checkout
        );
        expect(body.booking.additionalneeds).toBe(createBookingData.additionalneeds);

        // Step 9: Log test result
        logger.pass(
            `CREATE_BOOKING_ID_001 - Booking created successfully with ID: ${body.bookingid}`
        );
    });

  test('CREATE_BOOKING_ID_002 - should display created booking id in get booking ids response', async ({
    bookingService,
  }) => {
    /**
     * Test Summary:
     * Step 1: Setup test metadata
     * Step 2: Call POST /booking API to create booking
     * Step 3: Parse response and save booking id
     * Step 4: Call GET /booking API to get all bookings
     * Step 5: Check status code
     * Step 6: Verify created booking is in the response list
     * Step 7: Log test result
     */

    // Step 1: Setup test metadata
    await feature('Booking API');
    await story('Create and Verify Booking');
    await severity('critical');
    await description(
      'Verify that a newly created booking appears in GET /booking response list.'
    );

    let newBookingId: number;

    await test.step('Create booking and get booking list', async () => {
      // Step 2: Call POST /booking API
      logger.info('Creating a new booking for verification');
      const createResponse = await bookingService.createBooking(createBookingData);

      // Step 3: Parse response and save booking id
      const createBody = (await createResponse.json()) as CreateBookingResponse;
      newBookingId = createBody.bookingid;
      createdBookingId = newBookingId;

      await expectStatus(createResponse, 200);
      expect(createResponse.status()).toBe(200);
      expect(newBookingId).toBeGreaterThan(0);

      logger.info(`Booking created with ID: ${newBookingId}`);

      // Step 4: Call GET /booking API to get all bookings
      logger.info('Fetching all booking IDs');
      const getResponse = await bookingService.getBookingIds();
      const getBody = (await getResponse.json()) as BookingIdResponse[];

      await test.info().attach('created-and-fetched-bookings.json', {
        body: JSON.stringify(
          {
            createdBookingId: newBookingId,
            totalBookingsInList: getBody.length,
            bookingsList: getBody,
          },
          null,
          2
        ),
        contentType: 'application/json',
      });

      // Step 5: Check status code
      await expectStatus(getResponse, 200);
      expect(getResponse.status()).toBe(200);

      // Step 6: Verify created booking is in the response list
      expect(Array.isArray(getBody)).toBeTruthy();
      expect(getBody.length).toBeGreaterThan(0);

      const foundBooking = getBody.find(
        (booking) => booking.bookingid === newBookingId
      );

      expect(foundBooking).toBeDefined();
      expect(foundBooking?.bookingid).toBe(newBookingId);

      logger.info(
        `Created booking ID ${newBookingId} found in GET /booking response`
      );

      // Step 7: Log test result
      logger.pass(
        `CREATE_BOOKING_ID_002 - Created booking ID ${newBookingId} verified in GET /booking response`
      );
    });
  });

});