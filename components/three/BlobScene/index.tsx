import { ThreeScene, ThreeSceneProps } from '../ThreeScene';
import Blobs from './Blobs';

type BlobSceneProps = Omit<
  ThreeSceneProps,
  'children' | 'fpsLimit' | 'camera' | 'gl' | 'shadows'
>;

const gl: ThreeSceneProps['gl'] = {
  antialias: false,
  powerPreference: 'low-power',
  alpha: true,
};

const camera: ThreeSceneProps['camera'] = {
  fov: 50,
  near: 0.1,
  far: 500,
  position: [0, 0, 15],
};

const BlobScene: React.FC<BlobSceneProps> = (props) => {
  return (
    <ThreeScene
      fpsLimit={30}
      shadows={false}
      camera={camera}
      gl={gl}
      {...props}
    >
      <Blobs />
    </ThreeScene>
  );
};

export default BlobScene;
