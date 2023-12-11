import { useEffect } from 'react';
import { RootState, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export type OrbitControllerOptions = {
  autoRotate?: boolean;
  autoRotateSpeed?: boolean;
  dampingFactor?: number;
  domElement?: HTMLElement;
  enabled?: boolean;
  enableDamping?: boolean;
  enablePan?: boolean;
  enableRotate?: boolean;
  enableZoom?: boolean;
  keyPanSpeed?: number;
  keys?: {
    LEFT: string;
    UP: string;
    RIGHT: string;
    BOTTOM: string;
  };
  maxAzimuthAngle?: number;
  maxDistance?: number;
  maxPolarAngle?: number;
  maxZoom?: number;
  minAzimuthAngle?: number;
  minDistance?: number;
  minPolarAngle?: number;
  minZoom?: number;
};

interface Props {
  options: OrbitControllerOptions;
}

const cameraSelector = (state: RootState) => state.camera;
const glElementSelector = (state: RootState) => state.gl.domElement;

const OrbitController: React.FC<Props> = ({ options }) => {
  const camera = useThree(cameraSelector);

  const domElement = useThree(glElementSelector);

  useEffect(() => {
    const controls = new OrbitControls(camera, domElement);
    Object.entries(options)
      .filter(([key]) => key in controls)
      .forEach(([key, value]) => {
        controls[key] = value;
      });
    return () => controls.dispose();
  }, [options, camera, domElement]);

  return <></>;
};

export default OrbitController;
