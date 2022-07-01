import React, { useEffect, useRef, FC } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

type PointLightProps = {
  position: [number, number, number];
};

export const Lights: FC<PointLightProps> = ({ position = [0, 0, 0] }) => {
  return (
    <>
      <ambientLight color={'0xB7D6ED'} intensity={1} />
      <PointLight position={position} />
    </>
  );
};

const PointLight: FC<PointLightProps> = ({ position }) => {
  const meshRef = useRef<any>();
  const { scene } = useThree();

  useEffect(() => {
    if (!scene.userData.refs) scene.userData.refs = {};
    scene.userData.refs.lightMesh = meshRef;
  }, [scene.userData]);

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 64]} />
      <meshBasicMaterial color={'#B7D6ED'} side={THREE.DoubleSide} />
      <pointLight color={'#B7D6ED'} intensity={1} />
    </mesh>
  );
};
