import React, { useEffect, useRef } from 'react';
import FPSLimiter from './FPSLimiter';
import { Canvas, Props } from '@react-three/fiber';
import useIntersectionObserver from '@hooks/useIntersectionObserver';
import { clientRender } from '@components/Utilities/ClientRender';

export type ThreeSceneProps = Props &
    React.HTMLAttributes<HTMLDivElement> & { fpsLimit?: number };

const observerOptions: IntersectionObserverInit = {
    threshold: 0.1,
};

const ThreeScene = ({ children, fpsLimit, ...props }: ThreeSceneProps) => {
    const canvasRef = useRef();
    const { isVisible } = useIntersectionObserver(canvasRef, observerOptions);
    return (
        <Canvas {...props} ref={canvasRef}>
            <FPSLimiter limit={!isVisible ? 0 : fpsLimit}>
                {children}
            </FPSLimiter>
        </Canvas>
    );
};

export default ThreeScene;
