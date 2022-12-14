import { TRPCError } from '@trpc/server';
import { prisma } from '../db';
import { searchSchema } from '../schemas/search';
import { procedure, router } from '../trpc';
import { getAirportSchema, getAirportsSchema } from '../schemas';
import { getPaginatedResponse, parsePaginationRequest } from '../utils';

export const airportsRouter = router({
  getAirports: procedure.input(getAirportsSchema).query(async ({ input }) => {
    const { limit, page, skip, take } = parsePaginationRequest(input);
    const { sort, sortKey } = input;
    const [results, itemCount] = await prisma.$transaction([
      prisma.airport.findMany({
        skip,
        take,
        orderBy:
          sortKey !== undefined
            ? {
                [sortKey]: sort ?? 'asc',
              }
            : undefined,
      }),
      prisma.airport.count(),
    ]);
    return getPaginatedResponse({
      itemCount,
      limit,
      page,
      results,
    });
  }),
  searchAirports: procedure.input(searchSchema).query(async ({ input }) => {
    const { query } = input;
    const airports = await prisma.airport.findMany({
      take: 5,
      where: {
        OR: [
          {
            id: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    return airports;
  }),
  getAirport: procedure.input(getAirportSchema).query(async ({ input }) => {
    const { id } = input;
    const airport = await prisma.airport.findUnique({
      where: {
        id,
      },
    });
    if (airport === null) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Airport not found.',
      });
    }
    return airport;
  }),
});
