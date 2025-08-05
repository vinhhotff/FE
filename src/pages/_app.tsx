import { AppProps } from 'next/app';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import '@/app/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Global error handlers to catch unhandled errors
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      if (event.error?.name === 'AxiosError') {
        // Don't show toast for AxiosError as it should be handled in AuthContext
        return;
      }
      toast.error('An unexpected error occurred. Please try again.');
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Always prevent AxiosError from showing in console as unhandled
      if (event.reason?.name === 'AxiosError') {
        console.log('AxiosError caught by global handler - preventing default browser error');
        event.preventDefault(); // Prevent the default unhandled rejection error
        
        // Check if it's an authentication related error
        if (event.reason?.config?.url?.includes('/auth/login')) {
          console.log('Authentication AxiosError handled globally');
          // Don't show toast as AuthContext should handle it
          return;
        }
        
        // For other AxiosErrors, show generic message
        toast.error('A network error occurred. Please try again.');
        return;
      }
      
      // For non-Axios errors, show generic error
      toast.error('An unexpected error occurred. Please try again.');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          <Component {...pageProps} />
          <Toaster position="top-right" />
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
