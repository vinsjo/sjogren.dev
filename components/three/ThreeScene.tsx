import React from 'react';
import { Canvas, Props } from '@react-three/fiber';

import FPSLimiter from './FPSLimiter';
import { useInView } from 'react-intersection-observer';

export type ThreeSceneProps = Props &
  React.HTMLAttributes<HTMLDivElement> & { fpsLimit?: number };

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  children,
  fpsLimit,
  ...props
}: ThreeSceneProps) => {
  const [viewRef, inView] = useInView({
    threshold: 0.1,
    fallbackInView: true,
  });

  return (
    <Canvas {...props} ref={viewRef}>
      <FPSLimiter limit={inView ? fpsLimit : 0}>{children}</FPSLimiter>
    </Canvas>
  );
};
