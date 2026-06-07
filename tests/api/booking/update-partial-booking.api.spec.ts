import { feature, story, severity, description } from 'allure-js-commons';
import { test, expect } from '../../../src/fixtures/api.fixture';
import { createBookingData } from '../../../src/data/booking.data';
import { expectStatus } from '../../../src/api/assertions/response.assertion';
import { generateAuthToken } from '../../../src/helpers/token.helper';
import { randomString, randomPrice, randomAdditionalNeeds } from '../../../src/helpers/random.helper';
import type { CreateBookingResponse } from '../../../src/types/booking.type';
import { logger } from '../../../src/helpers/logger.helper';

test.describe('[Booking API] Partial Update Booking', () => {
  let bookingIdForUpdate: number | undefined;
  let authToken: string | undefined;

  test.beforeEach(async ({ bookingService, authService }) => {
    /**
     * Precondition Setup:
     * Step 1: Generate authentication token
     * Step 2: Create a booking for partial update test
     */

    // Step 1: Generate authentication token
    authToken = await generateAuthToken(authService);
    logger.info('Authentication token generated for partial update test');

    // Step 2: Create a booking
    const createResponse = await bookingService.createBooking(createBookingData);
    const createBody = (await createResponse.json()) as CreateBookingResponse;
    bookingIdForUpdate = createBody.bookingid;

    logger.info(`Booking created with ID: ${bookingIdForUpdate} for partial update test`);
  });

  test.afterEach(async ({ bookingService }) => {
    /**
     * Cleanup:
     * Delete the booking after test
     */
    if (bookingIdForUpdate && authToken) {
      await bookingService.deleteBooking(bookingIdForUpdate, authToken);
      logger.info(`Cleaned up booking with ID: ${bookingIdForUpdate}`);
    }
  });

  test('PATCH_BOOKING_FIRSTNAME_001 - should update firstname field only', async ({
    bookingService,
  }) => {
    // Setup test metadata
    await feature('Booking API');
    await story('Partial Update Booking - Firstname');
    await severity('normal');
    await description('Verify that PATCH /booking/:id updates firstname field only');

    const newFirstname = randomString('UpdatedFirstname');

    await test.step('Partial update firstname field', async () => {
      logger.info(`Updating firstname to: ${newFirstname}`);

      const patchResponse = await bookingService.partialUpdateBooking(
        bookingIdForUpdate!,
        { firstname: newFirstname },
        authToken!
      );

      await test.info().attach('patch-firstname-request.json', {
        body: JSON.stringify({ firstname: newFirstname }, null, 2),
        contentType: 'application/json',
      });

      await expectStatus(patchResponse, 200);
      expect(patchResponse.status()).toBe(200);

      const patchBody = await patchResponse.json();

      await test.info().attach('patch-firstname-response.json', {
        body: JSON.stringify(patchBody, null, 2),
        contentType: 'application/json',
      });

      // Verify firstname is updated
      expect(patchBody.firstname).toBe(newFirstname);

      // Verify other fields remain unchanged
      expect(patchBody.lastname).toBe(createBookingData.lastname);
      expect(patchBody.totalprice).toBe(createBookingData.totalprice);

      logger.pass(`PATCH_BOOKING_FIRSTNAME_001 - Firstname updated successfully`);
    });
  });

  test('PATCH_BOOKING_LASTNAME_001 - should update lastname field only', async ({
    bookingService,
  }) => {
    await feature('Booking API');
    await story('Partial Update Booking - Lastname');
    await severity('normal');
    await description('Verify that PATCH /booking/:id updates lastname field only');

    const newLastname = randomString('UpdatedLastname');

    await test.step('Partial update lastname field', async () => {
      logger.info(`Updating lastname to: ${newLastname}`);

      const patchResponse = await bookingService.partialUpdateBooking(
        bookingIdForUpdate!,
        { lastname: newLastname },
        authToken!
      );

      await expectStatus(patchResponse, 200);
      expect(patchResponse.status()).toBe(200);

      const patchBody = await patchResponse.json();

      expect(patchBody.lastname).toBe(newLastname);
      expect(patchBody.firstname).toBe(createBookingData.firstname);
      expect(patchBody.totalprice).toBe(createBookingData.totalprice);

      logger.pass(`PATCH_BOOKING_LASTNAME_001 - Lastname updated successfully`);
    });
  });

  test('PATCH_BOOKING_TOTALPRICE_001 - should update totalprice field only', async ({
    bookingService,
  }) => {
    await feature('Booking API');
    await story('Partial Update Booking - Total Price');
    await severity('normal');
    await description('Verify that PATCH /booking/:id updates totalprice field only');

    const newTotalPrice = randomPrice(200, 800);

    await test.step('Partial update totalprice field', async () => {
      logger.info(`Updating totalprice to: ${newTotalPrice}`);

      const patchResponse = await bookingService.partialUpdateBooking(
        bookingIdForUpdate!,
        { totalprice: newTotalPrice },
        authToken!
      );

      await expectStatus(patchResponse, 200);
      expect(patchResponse.status()).toBe(200);

      const patchBody = await patchResponse.json();

      expect(patchBody.totalprice).toBe(newTotalPrice);
      expect(patchBody.firstname).toBe(createBookingData.firstname);
      expect(patchBody.depositpaid).toBe(createBookingData.depositpaid);

      logger.pass(`PATCH_BOOKING_TOTALPRICE_001 - Total price updated successfully`);
    });
  });

  test('PATCH_BOOKING_DEPOSITPAID_001 - should update depositpaid field only', async ({
    bookingService,
  }) => {
    await feature('Booking API');
    await story('Partial Update Booking - Deposit Paid');
    await severity('normal');
    await description('Verify that PATCH /booking/:id updates depositpaid field only');

    const newDepositPaid = !createBookingData.depositpaid;

    await test.step('Partial update depositpaid field', async () => {
      logger.info(`Updating depositpaid to: ${newDepositPaid}`);

      const patchResponse = await bookingService.partialUpdateBooking(
        bookingIdForUpdate!,
        { depositpaid: newDepositPaid },
        authToken!
      );

      await expectStatus(patchResponse, 200);
      expect(patchResponse.status()).toBe(200);

      const patchBody = await patchResponse.json();

      expect(patchBody.depositpaid).toBe(newDepositPaid);
      expect(patchBody.firstname).toBe(createBookingData.firstname);
      expect(patchBody.totalprice).toBe(createBookingData.totalprice);

      logger.pass(`PATCH_BOOKING_DEPOSITPAID_001 - Deposit paid updated successfully`);
    });
  });

  test('PATCH_BOOKING_CHECKIN_001 - should update checkin date field only', async ({
    bookingService,
  }) => {
    await feature('Booking API');
    await story('Partial Update Booking - Checkin Date');
    await severity('normal');
    await description('Verify that PATCH /booking/:id updates checkin date field only');

    const newCheckinDate = '2026-02-15';

    await test.step('Partial update checkin date field', async () => {
      logger.info(`Updating checkin date to: ${newCheckinDate}`);

      const patchResponse = await bookingService.partialUpdateBooking(
        bookingIdForUpdate!,
        { 
          bookingdates: { 
            checkin: newCheckinDate,
            checkout: createBookingData.bookingdates.checkout
          } 
        },
        authToken!
      );

      await expectStatus(patchResponse, 200);
      expect(patchResponse.status()).toBe(200);

      const patchBody = await patchResponse.json();

      expect(patchBody.bookingdates.checkin).toBe(newCheckinDate);
      expect(patchBody.firstname).toBe(createBookingData.firstname);
      expect(patchBody.totalprice).toBe(createBookingData.totalprice);

      logger.pass(`PATCH_BOOKING_CHECKIN_001 - Checkin date updated successfully`);
    });
  });

  test('PATCH_BOOKING_CHECKOUT_001 - should update checkout date field only', async ({
    bookingService,
  }) => {
    await feature('Booking API');
    await story('Partial Update Booking - Checkout Date');
    await severity('normal');
    await description('Verify that PATCH /booking/:id updates checkout date field only');

    const newCheckoutDate = '2026-02-20';

    await test.step('Partial update checkout date field', async () => {
      logger.info(`Updating checkout date to: ${newCheckoutDate}`);

      const patchResponse = await bookingService.partialUpdateBooking(
        bookingIdForUpdate!,
        { 
          bookingdates: { 
            checkin: createBookingData.bookingdates.checkin,
            checkout: newCheckoutDate
          } 
        },
        authToken!
      );

      await expectStatus(patchResponse, 200);
      expect(patchResponse.status()).toBe(200);

      const patchBody = await patchResponse.json();

      expect(patchBody.bookingdates.checkout).toBe(newCheckoutDate);
      expect(patchBody.firstname).toBe(createBookingData.firstname);
      expect(patchBody.totalprice).toBe(createBookingData.totalprice);

      logger.pass(`PATCH_BOOKING_CHECKOUT_001 - Checkout date updated successfully`);
    });
  });

  test('PATCH_BOOKING_ADDITIONALNEEDS_001 - should update additionalneeds field only', async ({
    bookingService,
  }) => {
    await feature('Booking API');
    await story('Partial Update Booking - Additional Needs');
    await severity('normal');
    await description('Verify that PATCH /booking/:id updates additionalneeds field only');

    const newAdditionalNeeds = randomAdditionalNeeds();

    await test.step('Partial update additionalneeds field', async () => {
      logger.info(`Updating additionalneeds to: ${newAdditionalNeeds}`);

      const patchResponse = await bookingService.partialUpdateBooking(
        bookingIdForUpdate!,
        { additionalneeds: newAdditionalNeeds },
        authToken!
      );

      await expectStatus(patchResponse, 200);
      expect(patchResponse.status()).toBe(200);

      const patchBody = await patchResponse.json();

      expect(patchBody.additionalneeds).toBe(newAdditionalNeeds);
      expect(patchBody.firstname).toBe(createBookingData.firstname);
      expect(patchBody.totalprice).toBe(createBookingData.totalprice);

      logger.pass(`PATCH_BOOKING_ADDITIONALNEEDS_001 - Additional needs updated successfully`);
    });
  });
});
