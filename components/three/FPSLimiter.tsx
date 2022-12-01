import { useCallback, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { isNum } from 'x-is-type';
import { pick } from '@utils/misc';
import useRefreshRate from '@hooks/useRefreshRate';

/* based on: 
    https://github.com/pmndrs/react-three-fiber/discussions/667#discussioncomment-3026830
*/
function FPSLimiter(props: { limit?: number; children?: React.ReactNode }) {
    const state = useThree(
        useCallback((state) => {
            return pick(
                state,
                'invalidate',
                'clock',
                'setFrameloop',
                'frameloop'
            );
        }, [])
    );
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
        if (limit === 0) {
            if (state.frameloop !== 'never') state.setFrameloop('never');
            return;
        }
        if (state.frameloop !== 'demand') state.setFrameloop('demand');
        const interval = 1 / limit;

        let delta = 0;
        let animationID = 0;
        function update() {
            animationID = requestAnimationFrame(update);
            delta += state.clock.getDelta();
            if (delta <= interval) return;
            state.invalidate();
            delta = delta % interval;
        }
        update();
        return () => cancelAnimationFrame(animationID);
    }, [limit, state, props.children]);

    return !props.children ? null : <>{props.children}</>;
}

export default FPSLimiter;
