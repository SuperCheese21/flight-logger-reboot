import { flight } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import createHttpError from 'http-errors';
import { findBestMatch } from 'string-similarity';
import { fetchData } from './fetchData';
import { prisma } from '../db';
import { getFlightTimestamps } from '../utils';
import {
  getAircraftIcao,
  getAircraftName,
  getAirlineId,
  getAirportId,
  getFlightNumber,
} from '../utils/flightdiary';

interface FlightDiaryRow {
  Date: string;
  'Flight number': string;
  From: string;
  To: string;
  'Dep time': string;
  'Arr time': string;
  Duration: string;
  Airline: string;
  Aircraft: string;
  Registration: string;
  'Seat number': string;
  'Seat type': string;
  'Flight class': string;
  'Flight reason': string;
  Note: string;
  Dep_id: string;
  Arr_id: string;
  Airline_id: string;
  Aircraft_id: string;
}

export const saveFlightDiaryData = async (
  username: string,
  file?: Express.Multer.File,
): Promise<Array<flight | null>> => {
  if (file === undefined) {
    throw createHttpError(400, 'File not found');
  }
  const csv = file.buffer.toString();
  const parsedRows = parse(csv, {
    columns: true,
    skip_empty_lines: true,
  }) as FlightDiaryRow[];
  const rows: FlightDiaryRow[] = parsedRows.map(row => ({
    ...row,
    From: getAirportId(row.From) ?? '',
    To: getAirportId(row.To) ?? '',
    Airline: getAirlineId(row.Airline) ?? '',
  }));

  const airportIds = [
    ...new Set(
      rows.flatMap(row =>
        row.From !== '' && row.To !== '' ? [row.From, row.To] : [],
      ),
    ),
  ];
  const airlineIds = [
    ...new Set(rows.flatMap(row => (row.Airline !== '' ? [row.Airline] : []))),
  ];
  const aircraftTypeData = [
    ...new Set(
      rows.flatMap(row =>
        row.Aircraft !== '' ? [getAircraftIcao(row.Aircraft)] : [],
      ),
    ),
  ];

  const data = await fetchData({
    airportIds,
    airlineIds,
    aircraftTypeData,
    aircraftSearchType: 'icao',
  });

  return await prisma.$transaction(
    rows.flatMap(row => {
      const departureAirport = data.airports[row.From];
      const arrivalAirport = data.airports[row.To];
      if (departureAirport === undefined || arrivalAirport === undefined)
        return [];
      const airline = data.airlines[row.Airline];
      const aircraftIcao = getAircraftIcao(row.Aircraft);
      const aircraftName = getAircraftName(row.Aircraft);
      const aircraftTypes = data.aircraftTypes[aircraftIcao];
      const { bestMatchIndex } = findBestMatch(
        aircraftName,
        aircraftTypes?.map(({ name }) => name) ?? [''],
      );
      const { outTime, inTime, duration } = getFlightTimestamps({
        departureAirport,
        arrivalAirport,
        outDate: row.Date,
        outTime: row['Dep time'],
        offTime: null,
        onTime: null,
        inTime: row['Arr time'],
      });
      return [
        prisma.flight.create({
          data: {
            user: {
              connect: {
                username,
              },
            },
            departureAirport: {
              connect: {
                id: departureAirport.id,
              },
            },
            arrivalAirport: {
              connect: {
                id: arrivalAirport.id,
              },
            },
            airline:
              airline !== undefined
                ? {
                    connect: {
                      id: airline.id,
                    },
                  }
                : undefined,
            aircraftType:
              aircraftTypes !== undefined
                ? {
                    connect: {
                      id: aircraftTypes[bestMatchIndex].id,
                    },
                  }
                : undefined,
            flightNumber: getFlightNumber(row['Flight number']),
            tailNumber: row.Registration,
            outTime: outTime.toISOString(),
            inTime: inTime.toISOString(),
            duration,
            seatNumber: row['Seat number'],
            comments: row.Note,
          },
        }),
      ];
    }),
  );
};
