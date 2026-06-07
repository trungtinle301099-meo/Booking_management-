import type { APIResponse } from '@playwright/test';
import type { ApiClient } from '../clients/api-client';
import { bookingEndpoint } from '../endpoints/booking.endpoint';
import type { Booking, PartialUpdateBookingRequest } from '../../types/booking.type';

export class BookingService {
  constructor(private readonly apiClient: ApiClient) {}

  async getBookingIds(): Promise<APIResponse> {
    return this.apiClient.get(bookingEndpoint.booking);
  }

  async getBooking(bookingId: number): Promise<APIResponse> {
    return this.apiClient.get(bookingEndpoint.bookingById(bookingId));
  }

  async createBooking(payload: Booking): Promise<APIResponse> {
    return this.apiClient.post(bookingEndpoint.booking, payload);
  }

  async updateBooking(bookingId: number, payload: Booking, token: string): Promise<APIResponse> {
    return this.apiClient.put(bookingEndpoint.bookingById(bookingId), payload, {
      Cookie: `token=${token}`,
    });
  }

  async partialUpdateBooking(
    bookingId: number,
    payload: PartialUpdateBookingRequest,
    token: string,
  ): Promise<APIResponse> {
    return this.apiClient.patch(bookingEndpoint.bookingById(bookingId), payload, {
      Cookie: `token=${token}`,
    });
  }

  async deleteBooking(bookingId: number, token: string): Promise<APIResponse> {
    return this.apiClient.delete(bookingEndpoint.bookingById(bookingId), {
      Cookie: `token=${token}`,
    });
  }
}
