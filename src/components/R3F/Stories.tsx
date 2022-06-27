import React, { useMemo } from 'react';
import * as THREE from 'three';
import { LightningStrike } from 'three/examples/jsm/geometries/LightningStrike';
import { extend, useFrame } from '@react-three/fiber';

extend({
  LightningStrike,
});

interface Props {
  position?: [x: number, y: number, z: number];
}

export const Stories: React.FC<Props> = ({ position = [0, 0, 0] }) => {
  return (
    <>
      <Strike source={[0, 0, 0]} dest={[100, 100, 100]} />
    </>
  );
};

const Strike = ({ source, dest }: { source: number[]; dest: number[] }) => {
  const rayDirection = useMemo(
    () =>
      new THREE.Vector3().subVectors(
        new THREE.Vector3(...dest),
        new THREE.Vector3(...source),
      ),
    [source, dest],
  );

  const rayLength = useMemo(() => {
    return rayDirection.length();
  }, [rayDirection]);

  useFrame((state) => {});

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <meshBasicMaterial color={'#87e8de'} side={THREE.DoubleSide} />
        {/*// @ts-ignore*/}
        <lightningStrike
          destOffset={new THREE.Vector3(...dest)}
          sourceOffset={new THREE.Vector3(...source)}
          radius0={4}
          radius1={4}
          radius0Factor={0.82}
          minRadius={2.5}
          maxIterations={6}
          isEternal={true}
          timeScale={0.6}
          propagationTimeFactor={0.15}
          vanishingTimeFactor={0.87}
          subrayPeriod={0.8}
          ramification={5}
          recursionProbability={0.8}
          roughness={0.85}
          straightness={0.7}
          onSubrayCreation={(
            segment,
            parentSubray,
            childSubray,
            lightningStrike,
          ) => {
            lightningStrike.subrayConePosition(
              segment,
              parentSubray,
              childSubray,
              0.6,
              0.9,
              0.7,
            );

            // THREE.Sphere projection

            const vec1 = new THREE.Vector3();
            const vec2 = new THREE.Vector3();
            vec1.subVectors(
              childSubray.pos1,
              lightningStrike.rayParameters.sourceOffset,
            );
            vec2.set(0, 0, 0);

            if (lightningStrike.randomGenerator.random() < 0.7) {
              vec2.copy(rayDirection).multiplyScalar(rayLength * 1.0865);
            }

            vec1.add(vec2).setLength(rayLength);
            childSubray.pos1.addVectors(
              vec1,
              lightningStrike.rayParameters.sourceOffset,
            );
          }}
        />
      </mesh>
    </>
  );
};
