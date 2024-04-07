import React, { useRef } from 'react';
import { Canvas, Props } from '@react-three/fiber';

import FPSLimiter from './FPSLimiter';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

export type ThreeSceneProps = Props &
  React.HTMLAttributes<HTMLDivElement> & { fpsLimit?: number };

const observerOptions: IntersectionObserverInit = {
  threshold: 0.1,
};

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  children,
  fpsLimit,
  ...props
}: ThreeSceneProps) => {
  const canvasRef = useRef();
  const isVisible = useIntersectionObserver(canvasRef, observerOptions);

  return (
    <Canvas {...props} ref={canvasRef}>
      <FPSLimiter limit={isVisible ? fpsLimit : 0}>{children}</FPSLimiter>
    </Canvas>
  );
};
