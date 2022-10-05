import React from 'react';
import FPSLimiter from './FPSLimiter';
import { Canvas, Props } from '@react-three/fiber';

export type ThreeSceneProps = Props &
    React.HTMLAttributes<HTMLDivElement> & { fpsLimit?: number };

const ThreeScene = ({ children, fpsLimit, ...props }: ThreeSceneProps) => {
    return (
        <Canvas {...props}>
            <FPSLimiter limit={fpsLimit}>{children}</FPSLimiter>
        </Canvas>
    );
};

export default ThreeScene;
