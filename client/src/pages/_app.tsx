import { AppProps } from 'next/app';
import { AuthProvider } from '@/lib/auth';
import '@/styles/globals.css';
import { Toaster } from 'sonner';

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;