/* eslint-disable react/no-unknown-property */
import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { SphereGeometry, ShaderMaterial, Mesh } from 'three';
import { MeshProps, ThreeEvent, useFrame } from '@react-three/fiber';
import { isNum } from 'x-is-type/callbacks';
import { blobShader, getRandomOptions } from '@utils/client/three/shaders/blob';

export type ShaderBlobProps = Omit<
    MeshProps,
    'geometry' | 'onClick' | 'material'
> & {
    radius?: number;
    widthSegments?: number;
    heightSegments?: number;
    randomRefresh?: number;
};

const ShaderBlob = ({
    radius,
    widthSegments,
    heightSegments,
    scale,
    randomRefresh,
    ...meshProps
}: ShaderBlobProps) => {
    const [options, setOptions] = useState(getRandomOptions);
    const randomize = useCallback(
        () => setOptions(getRandomOptions()),
        [setOptions]
    );
    const sphere = useRef(
        new SphereGeometry(
            isNum(radius) ? radius : 1,
            isNum(widthSegments) ? widthSegments : 64,
            isNum(heightSegments) ? heightSegments : 32
        )
    );
    const mesh = useRef<Mesh<SphereGeometry, ShaderMaterial>>();
    const material = useMemo(
        () => blobShader(options.shader),
        [options.shader]
    );

    const handleClick = useCallback(
        (e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            randomize();
        },
        [randomize]
    );

    useFrame(() => {
        if (!mesh.current) return;
        const {
            rotation,
            material: { uniforms },
        } = mesh.current;
        const { rotationSpeed } = options.mesh;
        for (const key of ['x', 'y', 'z']) {
            rotation[key] += rotationSpeed[key];
        }
        uniforms.uTime.value += 0.1;
    });

    useEffect(() => {
        if (!randomRefresh || !isNum(randomRefresh)) return;
        const timeout = setTimeout(
            () => randomize(),
            Math.floor(Math.random() * randomRefresh)
        );
        return () => clearTimeout(timeout);
    }, [randomRefresh, randomize, options]);

    return (
        <mesh
            ref={mesh}
            scale={scale || options.mesh.scale}
            geometry={sphere.current}
            material={material}
            onClick={handleClick}
            {...meshProps}
        />
    );
};

export default ShaderBlob;
