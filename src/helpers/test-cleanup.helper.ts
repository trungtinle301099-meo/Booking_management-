import type { BookingService } from '../api/services/booking.service';
import { logger } from './logger.helper';
import { isRetryableApiResponse, retryAction } from './retry.helper';

export type CleanupBookingOptions = {
  bookingService: BookingService;
  bookingId?: number;
  token?: string;
  acceptedStatuses?: number[];
};

export type CleanupBookingResult = {
  skipped: boolean;
  cleaned: boolean;
  status?: number;
  bookingId?: number;
};

const DEFAULT_ACCEPTED_DELETE_STATUSES = [200, 201, 202, 204, 404];

export async function cleanupBooking(
  options: CleanupBookingOptions,
): Promise<CleanupBookingResult> {
  const acceptedStatuses = options.acceptedStatuses ?? DEFAULT_ACCEPTED_DELETE_STATUSES;

  if (!options.bookingId) {
    logger.info('Cleanup skipped because bookingId is not available');

    return {
      skipped: true,
      cleaned: false,
    };
  }

  if (!options.token) {
    logger.warn('Cleanup skipped because auth token is not available', {
      bookingId: options.bookingId,
    });

    return {
      skipped: true,
      cleaned: false,
      bookingId: options.bookingId,
    };
  }

  logger.setup('Cleanup booking started', {
    bookingId: options.bookingId,
  });

  const deleteResponse = await retryAction(
    () =>
      options.bookingService.deleteBooking(options.bookingId as number, options.token as string),
    {
      retries: 2,
      delayMs: 750,
      retryName: `Cleanup booking ${options.bookingId}`,
      retryOnResult: isRetryableApiResponse,
    },
  );

  const status = deleteResponse.status();
  const cleaned = acceptedStatuses.includes(status);

  if (cleaned) {
    logger.info('Cleanup booking completed', {
      bookingId: options.bookingId,
      status,
    });
  } else {
    logger.warn('Cleanup booking returned unexpected status', {
      bookingId: options.bookingId,
      status,
      acceptedStatuses,
    });
  }

  return {
    skipped: false,
    cleaned,
    status,
    bookingId: options.bookingId,
  };
}
