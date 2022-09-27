import { useState, useMemo, useCallback } from 'react';
import { isFn } from 'x-is-type/callbacks';

const usePointerHandlers = () => {
	const [pointer, setPointer] = useState({ down: false, grab: false });
	const handleDown = useCallback(() => {
		setPointer((pointer) => ({ ...pointer, down: true }));
	}, [setPointer]);
	const handleMove = useCallback(() => {
		setPointer((pointer) => {
			const { down, grab } = pointer;
			if (down === grab) return pointer;
			return { down, grab: down };
		});
	}, [setPointer]);
	const handleUp = useCallback(
		(callbackfn?: (grab: boolean) => unknown) => {
			if (isFn(callbackfn)) callbackfn(pointer.grab);
			setPointer({ down: false, grab: false });
		},
		[pointer, setPointer]
	);
	const handlers = useMemo(
		() => ({ down: handleDown, move: handleMove, up: handleUp }),
		[handleDown, handleMove, handleUp]
	);

	return handlers;
};

export default usePointerHandlers;
