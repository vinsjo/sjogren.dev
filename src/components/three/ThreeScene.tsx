import React from 'react';
import { Canvas, type Props as CanvasProps } from '@react-three/fiber';
import { useInView } from 'react-intersection-observer';

import FPSLimiter from './FPSLimiter';

export interface ThreeSceneProps
  extends CanvasProps,
    React.HTMLAttributes<HTMLDivElement> {
  fpsLimit?: number;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  children,
  fpsLimit = 60,
  ...props
}: ThreeSceneProps) => {
  const [viewRef, inView] = useInView({
    threshold: 0.1,
    fallbackInView: true,
  });

  return (
    <Canvas {...props} ref={viewRef}>
      <FPSLimiter limit={fpsLimit} disableAnimation={!inView} />
      {children}
    </Canvas>
  );
};
