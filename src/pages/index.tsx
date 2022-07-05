import { Canvas } from '@react-three/fiber';
import React, { useRef } from 'react';
import { Environment, OrbitControls, Stats } from '@react-three/drei';
import { DEV_MODE } from '@/utils';
import { ParticlesGroup } from '@/components/R3F/Particles';
import VolumetricSpotlight from '@/components/R3F/VolumetricSpotlight';
import { Stories } from '@/components/R3F/Stories';
import { Rig } from '@/components/R3F/Rig';

export default function HomePage() {
  const volumetricSpotlight = React.useRef<any>();

  return (
    <Canvas
      // dpr={window.devicePixelRatio}
      shadows
      camera={{
        fov: 100,
        near: 1,
        far: 1000,
        // position: [-30, -15, 30],
        // position: [6.5, 1, 6.5],
        rotation: [0, 90, 90],
      }}
    >
      {DEV_MODE && <Stats />}
      <OrbitControls
        enableZoom={DEV_MODE}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
      />

      <fog attach="fog" args={['#00474f']} />
      <Rig />

      <Environment background={true} files="/env.hdr" />

      {/*<SpotLight*/}
      {/*  position={[0, 20, 0]}*/}
      {/*  color={'#3E7088'}*/}
      {/*  // angle={Math.PI / 2}*/}
      {/*  intensity={1}*/}
      {/*  penumbra={1}*/}
      {/*  radiusBottom={1200}*/}
      {/*  distance={1000}*/}
      {/*/>*/}

      <VolumetricSpotlight
        target={volumetricSpotlight}
        position={[0, 20, 0]}
        intensity={1}
        penumbra={0.8}
        distance={0}
        color={'#3E7088'}
        angle={Math.PI / 3}
      />

      <ParticlesGroup />

      <Stories />

      {/*<Lights position={[0, 18, 0]} />*/}
      {/*<Effects />*/}

      <pointLight
        color="#3E7088"
        position={[0, 18, 0]}
        intensity={300}
        distance={80}
      />
    </Canvas>
  );
}
