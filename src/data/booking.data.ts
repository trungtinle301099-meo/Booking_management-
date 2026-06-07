import type { Booking, PartialUpdateBookingRequest } from '../types/booking.type';

export const createBookingData: Booking = {
  firstname: 'Jim',
  lastname: 'Brown',
  totalprice: 111,
  depositpaid: true,
  bookingdates: {
    checkin: '2026-01-01',
    checkout: '2026-01-05',
  },
  additionalneeds: 'Breakfast',
};

export const partialUpdateBookingData: PartialUpdateBookingRequest = {
  firstname: 'James',
  lastname: 'Brown',
};
