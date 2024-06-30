import { useState } from 'react';

import { ThreeScene, type ThreeSceneProps } from '../ThreeScene';
import Blobs from './Blobs';

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

type Props = Omit<React.HTMLProps<HTMLDivElement>, 'ref' | 'children'>;

const BlobScene: React.FC<Props> = (props) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div {...props} data-loaded={loaded}>
      <ThreeScene gl={gl} camera={camera} onCreated={() => setLoaded(true)}>
        <Blobs />
      </ThreeScene>
    </div>
  );
};

export default BlobScene;
