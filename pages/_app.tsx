import { StoreManager } from '@/components/utilities/StoreManager';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <StoreManager />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
