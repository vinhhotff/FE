import { AppProps } from 'next/app';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import '@/app/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryProvider>
  );
}
