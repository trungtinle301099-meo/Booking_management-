export const bookingEndpoint = {
  booking: '/booking',
  bookingById: (bookingId: number): string => `/booking/${bookingId}`,
} as const;
