import { Canvas } from '@react-three/fiber';
import React, { useEffect, Suspense } from 'react';
import {
  Environment,
  Loader,
  OrbitControls,
  Preload,
  Stats,
} from '@react-three/drei';
import { DEV_MODE } from '@/utils';
import { ParticlesGroup } from '@/components/R3F/Particles';
import { Stories } from '@/components/R3F/Stories';
import { Rig } from '@/components/R3F/Rig';
import { Title } from '@/components/R3F/Title';

export default function HomePage() {
  useEffect(() => {
    document.body.style.cursor = `url('/cursor.png'), auto`;
  }, []);

  return (
    <>
      <Canvas
        // dpr={window.devicePixelRatio}
        shadows
        camera={{
          fov: 100,
          near: 1,
          far: 1000,
          rotation: [0, 90, 90],
        }}
      >
        {DEV_MODE && <Stats />}
        <OrbitControls
          enableZoom={DEV_MODE}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
        />

        <Suspense fallback={null}>
          <fog attach="fog" args={['#00474f']} />
          <Rig />
          <Environment background={true} files="/env.hdr" />
          <Title />
          <ParticlesGroup />
          <Stories />
          <Preload all />
        </Suspense>

        <pointLight
          color="#3E7088"
          position={[0, 18, 0]}
          intensity={300}
          distance={80}
        />
      </Canvas>
      <Loader />
    </>
  );
}
