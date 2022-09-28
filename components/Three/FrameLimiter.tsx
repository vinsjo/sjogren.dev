import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

/* source: 
    https://github.com/pmndrs/react-three-fiber/discussions/667#discussioncomment-3026830
*/

function FrameLimiter({ fps = 30 }: { fps?: number }) {
	const { invalidate, clock } = useThree();
	useEffect(() => {
		if (typeof fps !== 'number' || fps <= 0) return;
		let delta = 0;
		let willUnmount = false;
		const interval = 1 / fps;
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
	}, [fps, invalidate, clock]);

	return null;
}

export default FrameLimiter;
