import { Combobox, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { forwardRef, ForwardedRef, useEffect } from 'react';
import { Input, InputProps } from 'react-daisyui';
import { FieldValues, useController, useFormContext } from 'react-hook-form';
import { useTypeaheadInput, UseTypeaheadInputOptions } from '../hooks';
import { FormFieldProps, GenericDataType } from '../types';
import { FormError } from './FormError';
import { FormLabel } from './FormLabel';

export interface TypeaheadInputProps<
  DataItem extends GenericDataType,
  Values extends FieldValues,
> extends UseTypeaheadInputOptions<DataItem>,
    FormFieldProps<Values>,
    Omit<InputProps, 'name'> {
  getItemText: (data: DataItem) => string;
  getItemValue: (data: DataItem) => string;
  options?: DataItem[];
}

export const TypeaheadInput = forwardRef(
  <DataItem extends GenericDataType, Values extends FieldValues>(
    {
      controllerProps,
      debounceTime,
      getItemText,
      getItemValue,
      isRequired,
      labelText,
      name,
      onDebouncedChange,
      options,
      ...props
    }: TypeaheadInputProps<DataItem, Values>,
    ref: ForwardedRef<HTMLInputElement>,
  ): JSX.Element => {
    const { setValue } = useFormContext();
    const {
      field: { value, ...field },
      fieldState: { error },
    } = useController({
      ...controllerProps,
      name,
    });
    const { isLoading, selectedItem, setQuery, setSelectedItem } =
      useTypeaheadInput<DataItem>({
        debounceTime,
        onDebouncedChange,
        options,
      });
    useEffect(() => {
      const itemValue = selectedItem !== null ? getItemValue(selectedItem) : '';
      setValue<string>(name, itemValue, {
        shouldValidate: selectedItem !== null,
      });
    }, [selectedItem]);
    useEffect(() => {
      if (value === '') setSelectedItem(null);
    }, [value]);
    return (
      <Combobox
        as="div"
        className="form-control w-full max-w-sm"
        name={name}
        nullable
        onChange={setSelectedItem}
        value={selectedItem}
      >
        {labelText !== undefined ? (
          <Combobox.Label as={FormLabel} isRequired={isRequired}>
            {labelText}
          </Combobox.Label>
        ) : null}
        <Combobox.Input
          {...field}
          as={Input}
          color={error === undefined ? 'ghost' : 'error'}
          displayValue={(item: DataItem | null) =>
            item !== null ? getItemText(item) : ''
          }
          onChange={({ target: { value } }) => setQuery(value)}
          ref={ref}
          {...props}
        />
        <div className="relative">
          <div className="absolute min-w-[200px] z-10 mt-[1px] w-full">
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Combobox.Options className="menu rounded-lg bg-base-300">
                {isLoading ? (
                  <Combobox.Option className="disabled" value={null}>
                    <p>Loading...</p>
                  </Combobox.Option>
                ) : null}
                {!isLoading && options?.length === 0 ? (
                  <Combobox.Option className="disabled" value={null}>
                    <p>No Results</p>
                  </Combobox.Option>
                ) : null}
                {!isLoading &&
                  options?.map(option => (
                    <Combobox.Option
                      className={({ active, disabled }) =>
                        classNames(
                          active ? 'bg-primary text-white' : 'bg-ghost',
                          disabled && 'disabled',
                        )
                      }
                      key={option.id}
                      value={option}
                    >
                      <p>{getItemText(option)}</p>
                    </Combobox.Option>
                  ))}
              </Combobox.Options>
            </Transition>
          </div>
        </div>
        {error?.message !== undefined ? (
          <FormError errorText={error.message} />
        ) : null}
      </Combobox>
    );
  },
);
