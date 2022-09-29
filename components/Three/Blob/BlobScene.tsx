import React from 'react';
import ThreeScene from '../ThreeScene';
import Blobs from './Blobs';

type BlobSceneProps = {
	onLoad?: () => unknown;
	className?: string;
};

const BlobScene = ({ onLoad, className }: BlobSceneProps) => {
	return (
		<ThreeScene
			className={className || null}
			fpsLimit={30}
			shadows={false}
			camera={{
				fov: 50,
				near: 0.1,
				far: 500,
				position: [0, 0, 15],
			}}
			gl={{ antialias: false }}
			onCreated={onLoad}
		>
			<Blobs />
		</ThreeScene>
	);
};

export default BlobScene;
