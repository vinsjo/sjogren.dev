import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { isNum } from 'x-is-type/callbacks';

/* source: 
    https://github.com/pmndrs/react-three-fiber/discussions/667#discussioncomment-3026830
*/

function FPSLimiter({
    limit = 30,
    children,
}: {
    limit?: number;
    children?: React.ReactNode;
}) {
    const { invalidate, clock, setFrameloop } = useThree();
    useEffect(() => {
        if (!isNum(limit) || limit <= 0) return;
        setFrameloop('demand');
        let delta = 0;
        let willUnmount = false;
        const interval = 1 / limit;
        function update() {
            if (willUnmount) return;
            requestAnimationFrame(update);
            delta += clock.getDelta();
            if (delta <= interval) return;
            invalidate();
            delta = delta % interval;
        }
        update();
        return () => {
            willUnmount = true;
        };
    }, [limit, invalidate, clock, setFrameloop, children]);

    return !children ? null : <>{children}</>;
}

export default FPSLimiter;
