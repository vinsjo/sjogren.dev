import RecoilStoreManager from '@components/utilities/RecoilStoreManager';
import { RecoilRoot } from 'recoil';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    return (
        <RecoilRoot>
            <RecoilStoreManager />
            <Component {...pageProps} />
        </RecoilRoot>
    );
}

export default MyApp;
