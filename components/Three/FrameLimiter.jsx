import { useEffect, useLayoutEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { isNum } from 'x-is-type';

/* source: 
    https://github.com/pmndrs/react-three-fiber/discussions/667#discussioncomment-2548146 
*/

const FrameLimiter = ({ fps = 60 }) => {
	const { set, get, advance, frameloop } = useThree();

	useLayoutEffect(() => {
		if (!isNum(fps)) return;
		const initFrameloop = get().frameloop;
		return () => {
			set({ frameloop: initFrameloop });
		};
	}, [fps, get, set]);

	useFrame((state) => {
		if (state.get().blocked || !isNum(fps)) return;
		state.set({ blocked: true });
		setTimeout(() => {
			state.set({ blocked: false });
			state.advance();
		}, Math.max(0, 1000 / fps - state.clock.getDelta()));
	});

	useEffect(() => {
		if (!isNum(fps)) return;
		if (frameloop !== 'never') {
			set({ frameloop: 'never' });
			advance();
		}
	}, [fps, frameloop, set, advance]);

	return null;
};

export default FrameLimiter;
