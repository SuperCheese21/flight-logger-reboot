import { z } from 'zod';
import { DATE_REGEX, TIME_REGEX } from '../constants';

export const itineraryFlightSchema = z.object({
  departureAirportId: z.string().min(1, 'Required'),
  arrivalAirportId: z.string().min(1, 'Required'),
  outDate: z.string().min(1, 'Required').regex(DATE_REGEX, 'Invalid Date'),
  outTime: z.string().min(1, 'Required').regex(TIME_REGEX, 'Invalid Time'),
  inTime: z.string().min(1, 'Required').regex(TIME_REGEX, 'Invalid Time'),
  airlineId: z.string(),
  aircraftTypeId: z.string(),
  flightNumber: z.number().int().nullable(),
  class: z
    .enum(['BASIC', 'ECONOMY', 'PREMIUM', 'BUSINESS', 'FIRST'])
    .nullable(),
});

export const getItinerarySchema = z.object({
  id: z.string().uuid('Must be a valid UUID'),
});

export const addItinerarySchema = z.array(itineraryFlightSchema);

export type AddItineraryRequest = z.infer<typeof addItinerarySchema>;

export type ItineraryFlight = z.infer<typeof itineraryFlightSchema>;
