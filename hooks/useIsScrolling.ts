import { useState, useEffect } from 'react';

const useIsScrolling = (resetScrollStateDelay = 250) => {
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolling(true);
        window.addEventListener('scroll', onScroll);
        return window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!isScrolling) return;
        const timeout = setTimeout(
            () => setIsScrolling(false),
            resetScrollStateDelay
        );
        return () => clearTimeout(timeout);
    }, [isScrolling, resetScrollStateDelay]);

    return isScrolling;
};
export default useIsScrolling;
