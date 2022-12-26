import classNames from 'classnames';
import { useState } from 'react';
import { Alert, Button, Toast, ToastProps } from 'react-daisyui';
import { AddItineraryFlightRequest } from '../../../app/schemas';
import { ChevronDownIcon, ChevronUpIcon } from '../../common/components';

export interface ItineraryFlightsToastProps
  extends Omit<ToastProps, 'horizontal' | 'vertical'> {
  flights: AddItineraryFlightRequest[];
  onReset: () => void;
}

export const ItineraryFlightsToast = ({
  className,
  flights,
  onReset,
  ...props
}: ItineraryFlightsToastProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Toast
      className={classNames('z-10', className)}
      horizontal="end"
      vertical="top"
      {...props}
    >
      <Alert
        className={classNames('w-[250px]', flights.length > 1 && 'pb-0')}
        status="info"
      >
        <div className="w-full flex flex-col">
          <table className="table table-compact w-full font-semibold">
            <thead>
              <tr>
                <th className="bg-transparent"></th>
                <th className="bg-transparent">Dep</th>
                <th className="bg-transparent">Arr</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight, index) =>
                index === flights.length - 1 || isExpanded ? (
                  <tr key={index} className="bg-transparent">
                    <th className="bg-transparent">{index + 1}</th>
                    <td className="bg-transparent">
                      {flight.departureAirportId}
                    </td>
                    <td className="bg-transparent">
                      {flight.arrivalAirportId}
                    </td>
                  </tr>
                ) : null,
              )}
            </tbody>
          </table>
          <div className="flex justify-around">
            <Button color="error" size="sm" onClick={onReset}>
              Reset
            </Button>
            <Button color="primary" size="sm">
              Create
            </Button>
          </div>
          {flights.length > 1 ? (
            <Button
              color="ghost"
              size="sm"
              onClick={() => setIsExpanded(expanded => !expanded)}
            >
              {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </Button>
          ) : null}
        </div>
      </Alert>
    </Toast>
  );
};