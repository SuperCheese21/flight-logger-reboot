import { KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { Menu } from 'react-daisyui';
import { FieldValues, useFormContext } from 'react-hook-form';
import { useDebouncedState } from '../hooks';
import { FormControl, FormControlProps } from './FormControl';

export interface TypeaheadInputProps<
  DataItem,
  Values extends FieldValues,
  TOutput,
> extends FormControlProps<Values, TOutput> {
  debounceTime?: number;
  getItemText: (data: DataItem) => string;
  getItemValue: (data: DataItem) => string;
  getMenuItem?: (data: DataItem) => JSX.Element | null;
  isFetching?: boolean;
  onDebouncedChange?: (value: string) => void;
  options?: DataItem[];
}

export const TypeaheadInput = <
  DataItem extends Record<string, unknown>,
  Values extends FieldValues,
  TOutput,
>({
  debounceTime,
  getItemText,
  getItemValue,
  getMenuItem,
  inputProps,
  isFetching,
  name,
  onDebouncedChange,
  options,
  ...props
}: TypeaheadInputProps<DataItem, Values, TOutput>): JSX.Element => {
  const [query, setQuery, debouncedQuery, isDebouncing] =
    useDebouncedState<string>('', debounceTime ?? 400);
  const [item, setItem] = useState<DataItem | null>(null);
  const [valueText, setValueText] = useState('');
  const { setValue } = useFormContext();
  const setSelectedItem = useCallback(
    (item: DataItem | null): void => {
      const itemText = item !== null ? getItemText(item) : '';
      const itemValue = item !== null ? getItemValue(item) : '';
      setItem(item);
      setValueText(itemText);
      setValue<string>(name, itemValue, {
        shouldValidate: item !== null,
      });
    },
    [getItemText],
  );
  const handleKeyDown = useCallback(
    ({ key }: KeyboardEvent<HTMLInputElement>) => {
      if (key === 'Tab') {
        const firstOption = options?.[0];
        if (firstOption !== undefined) setSelectedItem(firstOption);
      }
    },
    [options, setSelectedItem],
  );
  const isLoading = isDebouncing || isFetching;
  const formattedQuery = debouncedQuery.trim();
  useEffect(() => {
    onDebouncedChange?.(formattedQuery);
  }, [formattedQuery]);
  return (
    <FormControl
      inputProps={{
        onChange: ({ target: { value } }) => {
          setSelectedItem(null);
          setQuery(value);
        },
        onKeyDown: handleKeyDown,
        value: valueText !== '' ? valueText : query,
        ...inputProps,
      }}
      menuContent={
        <Menu className="rounded-lg bg-base-300">
          {isLoading === true && (
            <Menu.Item disabled>
              <p>Loading...</p>
            </Menu.Item>
          )}
          {isLoading === false && options?.length === 0 && (
            <Menu.Item disabled>
              <p>No Results</p>
            </Menu.Item>
          )}
          {isLoading === false &&
            item === null &&
            options !== undefined &&
            options.length > 0 &&
            options.map((item, index) => (
              <Menu.Item key={index}>
                <a onClick={() => setSelectedItem(item)}>
                  {getMenuItem !== undefined
                    ? getMenuItem(item)
                    : getItemText(item)}
                </a>
              </Menu.Item>
            ))}
        </Menu>
      }
      name={name}
      {...props}
    />
  );
};
