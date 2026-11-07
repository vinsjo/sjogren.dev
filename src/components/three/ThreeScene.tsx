import React, { useEffect, useState } from 'react';
import { Canvas, type CanvasProps } from '@react-three/fiber';
import { useInView } from 'react-intersection-observer';

import FPSLimiter from './FPSLimiter';

export interface ThreeSceneProps
  extends CanvasProps, React.HTMLAttributes<HTMLDivElement> {
  fpsLimit?: number;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  children,
  fpsLimit = 60,
  ...props
}: ThreeSceneProps) => {
  const [documentHidden, setDocumentHidden] = useState(false);
  const [viewRef, inView] = useInView({
    threshold: 0.1,
    fallbackInView: true,
  });

  useEffect(() => {
    const syncDocumentHidden = () => setDocumentHidden(document.hidden);
    syncDocumentHidden();
    document.addEventListener('visibilitychange', syncDocumentHidden);
    return () =>
      document.removeEventListener('visibilitychange', syncDocumentHidden);
  }, []);

  return (
    <Canvas {...props} ref={viewRef}>
      <FPSLimiter
        limit={fpsLimit}
        disableAnimation={documentHidden || !inView}
      />
      {children}
    </Canvas>
  );
};
