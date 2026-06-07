import { test as base } from '@playwright/test';
import { ApiClient } from '../api/clients/api-client';
import { AuthService } from '../api/services/auth.service';
import { BookingService } from '../api/services/booking.service';

type ApiFixtures = {
  apiClient: ApiClient;
  authService: AuthService;
  bookingService: BookingService;
};

export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },

  authService: async ({ apiClient }, use) => {
    await use(new AuthService(apiClient));
  },

  bookingService: async ({ apiClient }, use) => {
    await use(new BookingService(apiClient));
  },
});

export { expect } from '@playwright/test';
