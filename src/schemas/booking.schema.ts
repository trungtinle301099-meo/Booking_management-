import { z } from 'zod';

export const bookingDatesSchema = z.object({
  checkin: z.string(),
  checkout: z.string(),
});

export const bookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: bookingDatesSchema,
  additionalneeds: z.string().optional(),
});

export const createBookingResponseSchema = z.object({
  bookingid: z.number(),
  booking: bookingSchema,
});

export const bookingIdResponseSchema = z.object({
  bookingid: z.number(),
});

export const createTokenResponseSchema = z.object({
  token: z.string().min(1),
});
