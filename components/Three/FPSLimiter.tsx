import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { isNum } from 'x-is-type/callbacks';
import useRefreshRate from '@hooks/useRefreshRate';

/* source: 
    https://github.com/pmndrs/react-three-fiber/discussions/667#discussioncomment-3026830
*/

function FPSLimiter(props: { limit?: number; children?: React.ReactNode }) {
    const { invalidate, clock, setFrameloop, frameloop } = useThree();
    const maxFPS = useRefreshRate(500);

    const limit = useMemo<number | null>(() => {
        return !isNum(props.limit)
            ? null
            : props.limit <= 0
            ? 0
            : !maxFPS
            ? props.limit
            : Math.min(props.limit, maxFPS);
    }, [props.limit, maxFPS]);

    useEffect(() => {
        if (limit === null) return setFrameloop('always');
        if (limit === 0) {
            if (frameloop !== 'never') {
                console.log('pausing frameloop');
                setFrameloop('never');
            }
            return;
        }
        if (frameloop !== 'demand') setFrameloop('demand');
        const interval = 1 / limit;

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
    }, [limit, invalidate, clock, setFrameloop, props.children, frameloop]);

    return !props.children ? null : <>{props.children}</>;
}

export default FPSLimiter;
