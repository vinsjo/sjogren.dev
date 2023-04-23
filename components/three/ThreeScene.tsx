import React, { useRef } from 'react';
import { Canvas, Props } from '@react-three/fiber';
import { useIntersectionObserver } from 'usehooks-ts';
import FPSLimiter from './FPSLimiter';
// import useIntersectionObserver from '@hooks/useIntersectionObserver';

export type ThreeSceneProps = Props &
    React.HTMLAttributes<HTMLDivElement> & { fpsLimit?: number };

const observerOptions: IntersectionObserverInit = {
    threshold: 0.1,
};

const ThreeScene: React.FC<ThreeSceneProps> = ({
    children,
    fpsLimit,
    ...props
}: ThreeSceneProps) => {
    const canvasRef = useRef();
    const entry = useIntersectionObserver(canvasRef, observerOptions);
    return (
        <Canvas {...props} ref={canvasRef}>
            <FPSLimiter limit={entry?.isIntersecting ? fpsLimit : 0}>
                {children}
            </FPSLimiter>
        </Canvas>
    );
};

export default ThreeScene;
