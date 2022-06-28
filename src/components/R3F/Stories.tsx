import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Line, Point, Points } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useSpring } from '@react-spring/three';

interface Props {
  position?: [x: number, y: number, z: number];
}

const RADIUS = 10;
const COUNT = 6;
const RAD = (2 * Math.PI) / COUNT;
const points: {
  from: [number, number, number];
  to: [number, number, number];
}[] = new Array(COUNT).fill(0).map((_, index) => {
  const x = RADIUS * Math.cos(RAD * index);
  const yFrom = index % 2 === 0 ? -1 : 1;
  const yTo = index % 2 === 0 ? 1 : -1;
  const z = RADIUS * Math.sin(RAD * index);
  return { from: [x, yFrom, z], to: [x, yTo, z] };
});

export const Stories: React.FC<Props> = ({ position = [0, 0, 0] }) => {
  const storiesRef = useRef<any>();

  useFrame((state) => {
    storiesRef.current.rotation.y += 0.0008;
  });

  return (
    <>
      <CenterPoint />
      <group ref={storiesRef}>
        {points.map(({ from, to }, index) => (
          <Strike key={index} source={[0, 0, 0]} dest={{ from, to }} />
        ))}
        <EffectComposer multisampling={8}>
          <Bloom
            kernelSize={3}
            luminanceThreshold={0}
            luminanceSmoothing={0.4}
            intensity={0.6}
          />
        </EffectComposer>
      </group>
    </>
  );
};

const CenterPoint = () => {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.2, 64, 64]}>
        <meshBasicMaterial color={'#b5f5ec'} />
      </sphereGeometry>
    </mesh>
  );
};

const Strike = ({
  source,
  dest,
}: {
  source: [number, number, number];
  dest: {
    from: [number, number, number];
    to: [number, number, number];
  };
}) => {
  const ref = useRef<any>();
  useFrame(() => {
    ref.current.distEnd = value.d;
  });

  const value = useSpring({
    loop: true,
    config: { duration: 1000 },
    from: { d: dest.from },
    to: { d: dest.to },
  });

  return (
    <>
      <Line ref={ref} points={[source, dest.from]} color={'#87e8de'} />
    </>
  );
};
