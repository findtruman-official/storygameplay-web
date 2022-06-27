import React, { useEffect, useState, FC } from 'react';
import type * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { EffectComposer, GodRays } from '@react-three/postprocessing';

export const Effects: FC = () => {
  const config = {
    enabled: true,
    samples: 100,
    density: 0.96,
    decay: 0.94,
    weight: 0.3,
    exposure: 1,
    blur: 1,
    kernelSize: 1,
    blendFunction: 1,
  };

  const [lightMesh, setLightMesh] =
    useState<
      React.MutableRefObject<
        THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
      >
    >();

  const { scene } = useThree();

  useEffect(() => {
    if (scene.userData.refs && scene.userData.refs.lightMesh) {
      const lightMeshRef = scene.userData.refs.lightMesh;
      setLightMesh(lightMeshRef);
    }
  }, [scene.userData.refs]);

  return (
    <EffectComposer>
      <>{lightMesh && <GodRays sun={lightMesh.current!} {...config} />}</>
    </EffectComposer>
  );
};
