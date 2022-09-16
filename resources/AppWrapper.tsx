import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

import { AppContextProvider } from './context';

const queryClient = new QueryClient();

export interface AppWrapperProps {
  children: ReactNode;
}

export const AppWrapper = ({ children }: AppWrapperProps): JSX.Element => (
  <AppContextProvider>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </AppContextProvider>
);
