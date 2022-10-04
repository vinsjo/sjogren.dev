import React from 'react';
import Blobs from './Blobs';
import { Canvas, Props } from '@react-three/fiber';

type BlobSceneProps = Omit<Props, 'children'> &
    React.HTMLAttributes<HTMLDivElement>;

const glProps: Props['gl'] = {
    antialias: false,
    powerPreference: 'low-power',
    alpha: true,
};

const camProps: Props['camera'] = {
    fov: 50,
    near: 0.1,
    far: 500,
    position: [0, 0, 15],
};

const BlobScene = ({
    shadows = false,
    camera = camProps,
    gl = glProps,
    className,
    ...props
}: BlobSceneProps) => {
    return (
        <Canvas shadows={shadows} camera={camera} gl={gl} {...props}>
            <Blobs />
        </Canvas>
    );
};

export default BlobScene;
