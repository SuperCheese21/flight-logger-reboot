import { useState } from 'react';
import { TypeaheadInput } from '../../common/components';
import { useTRPCErrorHandler } from '../../common/hooks';
import { trpc } from '../../utils/trpc';

export interface ArrivalAirportInputProps {
  isRequired?: boolean;
}

export const ArrivalAirportInput = ({
  isRequired,
}: ArrivalAirportInputProps): JSX.Element => {
  const [query, setQuery] = useState('');
  const { data, error, isFetching } = trpc.airports.searchAirports.useQuery(
    {
      query,
    },
    {
      enabled: query.length > 0,
    },
  );
  useTRPCErrorHandler(error?.data);
  return (
    <TypeaheadInput
      isRequired={isRequired}
      labelText="Arrival Airport"
      name="arrivalAirportId"
      getItemText={({ id, name }) => `${id} - ${name}`}
      getItemValue={({ id }) => id}
      isFetching={isFetching}
      onDebouncedChange={setQuery}
      options={data}
    />
  );
};
