import { useState, useEffect } from 'react';
import UAParser from 'ua-parser-js';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const { type } = new UAParser(navigator.userAgent).getDevice();
        setIsMobile(['mobile', 'tablet'].includes(type));
    }, []);
    return isMobile;
};

export default useIsMobile;
