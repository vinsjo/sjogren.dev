import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { isNum } from 'x-is-type';

/* source: 
    https://github.com/pmndrs/react-three-fiber/discussions/667#discussioncomment-3026830
*/

function FrameLimiter({ fps = 60 }) {
	const { invalidate, clock } = useThree();
	useEffect(() => {
		if (!isNum(fps) || fps === 0) return;
		let delta = 0;
		const interval = 1 / fps;
		const update = () => {
			requestAnimationFrame(update);
			delta += clock.getDelta();

			if (delta > interval) {
				invalidate();
				delta = delta % interval;
			}
		};
		update();
	}, [fps, invalidate, clock]);

	return null;
}

export default FrameLimiter;
