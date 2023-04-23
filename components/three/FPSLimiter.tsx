import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { isNum } from 'x-is-type';

import useRefreshRate from '@hooks/useRefreshRate';
// import { createSelectors } from '@utils/three/createSelectors';

// const selectors = createSelectors(
//     'invalidate',
//     'clock',
//     'setFrameloop',
//     'frameloop'
// );

/* based on: 
    https://github.com/pmndrs/react-three-fiber/discussions/667#discussioncomment-3026830
*/
function FPSLimiter(props: { limit?: number; children?: React.ReactNode }) {
    const { frameloop, setFrameloop, clock, invalidate } = useThree();
    // const frameloop = useThree(selectors.frameloop);
    // const setFrameloop = useThree(selectors.setFrameloop);
    // const clock = useThree(selectors.clock);
    // const invalidate = useThree(selectors.invalidate);

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
        if (limit === null) return;
        if (typeof setFrameloop === 'function') {
            if (limit === 0) {
                if (frameloop !== 'never') setFrameloop?.('never');
                return;
            }
            if (frameloop !== 'demand') setFrameloop?.('demand');
        }

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
    }, [limit, frameloop, clock, invalidate, setFrameloop, props.children]);

    return !props.children ? null : <>{props.children}</>;
}

export default FPSLimiter;
