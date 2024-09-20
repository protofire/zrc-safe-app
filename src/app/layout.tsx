'use client';

import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CircularProgress from '@/components/CircularProgress';
import SafeProvider from '@safe-global/safe-apps-react-sdk';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import {
  useThemeMode,
  SafeThemeProvider,
} from '@safe-global/safe-react-components';
import theme from "@/theme";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { themeMode } = useThemeMode('dark');
  return (
    <html lang="en">
      <body>
        <CacheProvider>
          <ChakraProvider theme={theme}>
            <SafeThemeProvider mode={themeMode}>
              {() => (
                <QueryClientProvider client={queryClient}>
                  <SafeProvider
                    loader={
                      <>
                        <h1>Waiting for Safe...</h1>
                        <CircularProgress />
                      </>
                    }
                  >
                    {children}
                  </SafeProvider>
                </QueryClientProvider>
              )}
            </SafeThemeProvider>
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  );
}
