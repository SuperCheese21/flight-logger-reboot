import { TRPCError } from '@trpc/server';
import { prisma } from '../db';
import { procedure, router } from '../trpc';
import { getRegionSchema, getRegionsSchema, searchSchema } from '../schemas';
import { getPaginatedResponse, parsePaginationRequest } from '../utils';

export const regionsRouter = router({
  getRegions: procedure.input(getRegionsSchema).query(async ({ input }) => {
    const { limit, page, skip, take } = parsePaginationRequest(input);
    const { sort, sortKey } = input;
    const [results, itemCount] = await prisma.$transaction([
      prisma.region.findMany({
        skip,
        take,
        orderBy:
          sortKey !== undefined
            ? {
                [sortKey]: sort ?? 'asc',
              }
            : undefined,
      }),
      prisma.region.count(),
    ]);
    return getPaginatedResponse({
      itemCount,
      limit,
      page,
      results,
    });
  }),
  searchRegions: procedure.input(searchSchema).query(async ({ input }) => {
    const { query } = input;
    const regions = await prisma.region.findMany({
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
    return regions;
  }),
  getRegion: procedure.input(getRegionSchema).query(async ({ input }) => {
    const { id } = input;
    const region = await prisma.region.findUnique({
      where: {
        id,
      },
    });
    if (region === null) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Region not found.',
      });
    }
    return region;
  }),
});
