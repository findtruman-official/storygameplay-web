import React, { useMemo, useRef } from 'react';
import { Image } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Title = () => {
  const textRef = useRef<any>();

  const vector = useMemo(() => new THREE.Vector3(), []);
  const vector2 = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const { x, y, z } = state.camera.position;
    textRef.current.position.lerp(
      vector.set(0, state.mouse.y / 2 + y + 2, state.mouse.x / 2),
      0.05,
    );

    const { x: cX, y: cY, z: cZ } = state.camera.position;
    textRef.current.lookAt(vector2.set(cX, cY, cZ));
  });

  return (
    <>
      <Image
        ref={textRef}
        scale={3}
        position={[0, -9, 0]}
        url={'./logo.png'}
        transparent={true}
      />
    </>
  );
};
