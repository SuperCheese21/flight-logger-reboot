import { PageElement } from 'express-paginate';
import { AlertProps } from 'react-daisyui';

export interface AlertMessage {
  status: AlertProps['status'];
  message: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
}

export interface PaginatedQueryOptions {
  pageIndex?: number;
  pageSize?: number;
}

export interface PaginationMetadata {
  page: number;
  pageCount: number;
  limit: number;
  itemCount: number;
  pages: PageElement[];
}

export interface PaginatedResults<Data> {
  metadata: PaginationMetadata;
  results: Data[];
}
