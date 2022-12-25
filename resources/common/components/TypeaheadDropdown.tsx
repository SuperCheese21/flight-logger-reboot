import { Combobox } from '@headlessui/react';
import classNames from 'classnames';
import { Fragment, ReactNode, useRef } from 'react';
import { Progress } from 'react-daisyui';
import { FieldValues } from 'react-hook-form';
import { Dropdown } from './Dropdown';
import { DropdownMenu } from './DropdownMenu';
import { DropdownOption } from './DropdownOption';
import { useOutsideClick } from '../hooks';
import { GenericDataType, TypeaheadSelectProps } from '../types';

export interface TypeaheadDropdownProps<
  DataItem extends GenericDataType,
  Values extends FieldValues,
  Element extends HTMLElement,
> extends Pick<
    TypeaheadSelectProps<DataItem, Values, Element>,
    'getItemText' | 'getItemValue' | 'options'
  > {
  children?: ReactNode;
  isLoading: boolean;
  onClose?: () => void;
  show?: boolean;
}

export const TypeaheadDropdown = <
  DataItem extends GenericDataType,
  Values extends FieldValues,
  Element extends HTMLElement,
>({
  children,
  getItemText,
  getItemValue,
  isLoading,
  onClose,
  options,
  show,
}: TypeaheadDropdownProps<DataItem, Values, Element>): JSX.Element => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick(dropdownRef, () => onClose?.());
  return (
    <Dropdown
      onKeyDown={({ key }) => {
        if (key === 'Escape') onClose?.();
      }}
      ref={dropdownRef}
    >
      {show === undefined || show ? (
        <Combobox.Options as={DropdownMenu} static={show !== undefined}>
          {children}
          {isLoading ? (
            <Progress
              className={classNames(children !== undefined && 'mt-2')}
            />
          ) : null}
          {!isLoading && options?.length === 0 ? (
            <DropdownOption disabled>No Results</DropdownOption>
          ) : null}
          {!isLoading &&
            options?.map((option, index) => (
              <Combobox.Option
                as={Fragment}
                key={getItemValue(option)}
                value={option}
              >
                {({ active, disabled, selected }) => (
                  <DropdownOption
                    active={active}
                    className={classNames(
                      children !== undefined && index === 0 && 'mt-2',
                    )}
                    disabled={disabled}
                    selected={selected}
                  >
                    {getItemText(option)}
                  </DropdownOption>
                )}
              </Combobox.Option>
            ))}
        </Combobox.Options>
      ) : null}
    </Dropdown>
  );
};
