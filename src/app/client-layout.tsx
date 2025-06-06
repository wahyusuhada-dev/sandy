'use client';

import { Providers } from './providers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box } from '@chakra-ui/react';
import Header from '@/components/Header';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <Providers>
        <Box minH="100vh">
          <Header />
          {children}
        </Box>
      </Providers>
    </QueryClientProvider>
  );
}
