import { Card, Divider, Progress } from 'react-daisyui';
import { useParams } from 'react-router-dom';
import { BADGE_COLORS_MAP } from './constants';
import { AirlineLogo, Badge } from '../../common/components';
import { trpc } from '../../utils/trpc';

export const Itinerary = (): JSX.Element | null => {
  const { id } = useParams();
  const { data, isLoading } = trpc.itineraries.getItinerary.useQuery(
    {
      id: id ?? '',
    },
    {
      enabled: id !== undefined,
    },
  );
  return (
    <>
      <div className="flex justify-center mb-4">
        <h1 className="text-3xl font-bold">Itinerary</h1>
      </div>
      {isLoading ? <Progress /> : null}
      {data?.flights.map((flight, index) => (
        <>
          {flight.layoverDuration.length > 0 ? (
            <Divider>
              Layover at {flight.departureAirport.iata} (
              {flight.layoverDuration})
            </Divider>
          ) : null}
          <Card key={index} className="bg-base-200 shadow-lg">
            <Card.Body className="flex-row gap-4 justify-between items-center">
              <AirlineLogo
                className="hidden sm:block"
                url={flight.airline?.logo}
              />
              <div className="flex-1 flex flex-col opacity-80">
                {flight.airline?.name}
                <div className="opacity-60 text-xs">
                  {flight.airline?.iata ?? ''} {flight.flightNumber}
                </div>
              </div>
              <div className="flex-[3] flex gap-2 flex-wrap justify-center font-semibold truncate">
                <div>
                  {flight.departureAirport.municipality} (
                  {flight.departureAirport.iata})
                </div>
                <div className="font-normal">to</div>
                <div>
                  {flight.arrivalAirport.municipality} (
                  {flight.arrivalAirport.iata})
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="text-sm opacity-70">Travel Time</div>
                <div className="font-mono">{flight.duration}</div>
              </div>
              <div className="flex-1 flex flex-col text-sm gap-1">
                <div className="text-sm opacity-70">Aircraft</div>
                {flight.aircraftType?.name ?? ''}
              </div>
              <div className="w-[75px] hidden sm:flex">
                {flight.class !== null ? (
                  <Badge
                    className="text-xs"
                    color={BADGE_COLORS_MAP[flight.class]}
                    size="sm"
                  >
                    {flight.class}
                  </Badge>
                ) : null}
              </div>
            </Card.Body>
          </Card>
        </>
      ))}
    </>
  );
};
