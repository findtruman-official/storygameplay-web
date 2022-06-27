import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import React, { useRef } from 'react';
import { Lights } from '@/components/R3F/Lights';
import { Effects } from '@/components/R3F/Effects';
import { OrbitControls, Stats } from '@react-three/drei';
import { DEV_MODE } from '@/utils';
import { Particles } from '@/components/R3F/Particles';
import VolumetricSpotlight from '@/components/R3F/VolumetricSpotlight';
import { Stories } from '@/components/R3F/Stories';

export default function HomePage() {
  const mouse = useRef([0, 0]);
  const volumetricSpotlight = React.useRef<any>();

  return (
    <Canvas
      // dpr={window.devicePixelRatio}
      shadows
      camera={{
        fov: 100,
        // aspect: window.innerWidth / window.innerHeight,
        // near: 10,
        far: 1000,
        position: [10, 10, 10],
        rotation: [0, 90, 90],
      }}
    >
      {DEV_MODE && <Stats />}
      <OrbitControls />
      <color attach="background" args={['#03090e']} />
      <fog attach="fog" args={['#00474f']} />
      {/*<Rig />*/}

      <VolumetricSpotlight
        target={volumetricSpotlight}
        position={[0, 20, 0]}
        intensity={1}
        penumbra={0.8}
        distance={0}
        color={'#3E7088'}
        angle={Math.PI / 3}
      />

      <Particles />

      <Stories />

      <Lights position={[0, 18, 0]} />
      <Effects />

      <pointLight
        color="#3E7088"
        position={[0, 18, 0]}
        intensity={300}
        distance={80}
      />
    </Canvas>
  );
}