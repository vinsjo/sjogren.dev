import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { isNum } from 'x-is-type/callbacks';
import useRefreshRate from '@hooks/useRefreshRate';

/* source: 
    https://github.com/pmndrs/react-three-fiber/discussions/667#discussioncomment-3026830
*/

function FPSLimiter({
    limit,
    children,
}: {
    limit?: number;
    children?: React.ReactNode;
}) {
    const maxFPS = useRefreshRate(1000, !limit);

    const fps = useMemo(() => {
        console.log(maxFPS);
        return !isNum(limit) || limit <= 0
            ? 0
            : !maxFPS
            ? 0
            : Math.min(limit, maxFPS);
    }, [limit, maxFPS]);

    const { invalidate, clock, setFrameloop } = useThree();
    useEffect(() => {
        if (!fps) return;
        const interval = 1 / fps;
        setFrameloop('demand');
        let delta = 0;
        let animationID = 0;
        function update() {
            animationID = requestAnimationFrame(update);
            delta += clock.getDelta();
            if (delta <= interval) return;
            invalidate();
            delta = delta % interval;
        }
        update();
        return () => cancelAnimationFrame(animationID);
    }, [fps, invalidate, clock, setFrameloop, children]);

    return !children ? null : <>{children}</>;
}

export default FPSLimiter;
