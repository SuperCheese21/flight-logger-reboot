import {
  TRPCErrorShape,
  TRPC_ERROR_CODE_KEY,
  TRPC_ERROR_CODE_NUMBER,
} from '@trpc/server/rpc';
import { RefObject } from 'react';
import { AlertProps } from 'react-daisyui';
import { FieldValues, Path, UseControllerProps } from 'react-hook-form';
import { typeToFlattenedError } from 'zod';
import { UseTypeaheadInputOptions } from './hooks';

export type GenericDataType = { id: string | number } & Record<string, unknown>;

export interface AlertMessage {
  status: AlertProps['status'];
  message: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
}

export interface DefaultErrorData {
  [x: string]: unknown;
  code: TRPC_ERROR_CODE_KEY;
  httpStatus: number;
  path?: string;
  stack?: string;
  zodError?: typeToFlattenedError<Record<string, unknown>, string> | null;
}

export interface DefaultErrorShape
  extends TRPCErrorShape<TRPC_ERROR_CODE_NUMBER, DefaultErrorData> {
  message: string;
  code: TRPC_ERROR_CODE_NUMBER;
}

export interface FormFieldProps<Values extends FieldValues> {
  controllerProps?: Omit<UseControllerProps<Values>, 'name'>;
  isRequired?: boolean;
  labelText?: string;
  name: Path<Values>;
}

export interface TypeaheadSelectProps<
  DataItem extends GenericDataType,
  Values extends FieldValues,
  Element extends HTMLElement,
> extends UseTypeaheadInputOptions<DataItem>,
    FormFieldProps<Values> {
  getItemText: (data: DataItem) => string;
  getItemValue: (data: DataItem) => string;
  inputRef?: RefObject<Element>;
}

export interface PaginationMetadata {
  page: number;
  pageCount: number;
  limit: number;
  itemCount: number;
  pages: Array<number | null>;
}

export interface PaginatedResults<Data> {
  metadata: PaginationMetadata;
  results: Data[];
}

export interface Transform<TOutput> {
  output: (val: string) => TOutput;
  input: (val: TOutput) => string;
}
