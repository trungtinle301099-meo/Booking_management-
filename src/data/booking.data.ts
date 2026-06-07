import type { Booking, PartialUpdateBookingRequest } from '../types/booking.type';
import { randomString, randomPrice, randomBookingDates, randomAdditionalNeeds } from '../helpers/random.helper';

const { checkin, checkout } = randomBookingDates();

export const createBookingData: Booking = {
  firstname: randomString('FirstName'),
  lastname: randomString('LastName'),
  totalprice: randomPrice(50, 500),
  depositpaid: true,
  bookingdates: {
    checkin,
    checkout,
  },
  additionalneeds: randomAdditionalNeeds(),
};

export const partialUpdateBookingData: PartialUpdateBookingRequest = {
  firstname: randomString('UpdateFirstName'),
  lastname: randomString('UpdateLastName'),
};
