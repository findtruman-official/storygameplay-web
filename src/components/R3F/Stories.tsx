import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Line, Text3D } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import Font from '@/assets/fonts/Lato-Regular.json';

interface Props {
  position?: [x: number, y: number, z: number];
}

const RADIUS = 8;
const COUNT = 12;
const RAD = (2 * Math.PI) / COUNT;
const points: {
  from: [number, number, number];
  to: [number, number, number];
}[] = new Array(COUNT).fill(0).map((_, index) => {
  const x = RADIUS * Math.cos(RAD * index);
  const z = RADIUS * Math.sin(RAD * index);
  return { from: [x, 1, z], to: [x, -1, z] };
});

export const Stories: React.FC<Props> = ({ position = [0, 0, 0] }) => {
  const storiesRef = useRef<any>();

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  useFrame((state) => {
    if (!hovered) {
      storiesRef.current.rotation.y += 0.002;
    }
    const { x, y, z } = state.camera.position;
    state.camera.position.lerp(
      new THREE.Vector3(
        x > 6.5 ? x : x + 0.2,
        0,
        // y > 1 ? y : y + 0.05,
        z < -6.5 ? z : z - 0.1,
      ),
      1,
    );
    // state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <CenterPoint />
      <group ref={storiesRef}>
        {points.map(({ from, to }, index) => (
          <Strike
            key={index}
            source={[0, 0, 0]}
            dest={{ from, to }}
            onHover={() => setHovered(true)}
            onHoverOut={() => {
              setHovered(false);
            }}
          />
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
      <sphereGeometry args={[0.1, 64, 64]}>
        <meshBasicMaterial color={'#b5f5ec'} />
      </sphereGeometry>
    </mesh>
  );
};

const Strike = ({
  source,
  dest,
  onHover,
  onHoverOut,
}: {
  source: [number, number, number];
  dest: {
    from: [number, number, number];
    to: [number, number, number];
  };
  onHover: () => void;
  onHoverOut: () => void;
}) => {
  const textRef = useRef<any>();
  const lineRef = useRef<any>();
  const bookRef = useRef<any>();

  // useFrame(() => {
  //   lineRef.current.distEnd = value.d;
  //   // bookRef.current.position.set(value.d);
  // });

  // const value = useSpring({
  //   loop: true,
  //   config: { duration: 1000 },
  //   from: { d: dest.from },
  //   to: { d: dest.to },
  // });

  useEffect(() => {
    if (textRef) {
      const geometry = textRef.current.geometry;
      geometry.center();
      const position = textRef.current.position;
      textRef.current.position.set(position.x, position.y + 0.3, position.z);

      textRef.current.lookAt(new THREE.Vector3(0, dest.from[1], 0));
      textRef.current.rotateY(Math.PI);
    }
  }, []);

  useEffect(() => {
    if (bookRef) {
      bookRef.current.lookAt(new THREE.Vector3(0, dest.from[1], 0));
    }
  }, []);

  return (
    <>
      {/*//@ts-ignore*/}
      <Text3D
        ref={textRef}
        font={Font}
        size={0.05}
        height={0.01}
        position={dest.from}
      >
        {`BLOODY\nCHURCH`}
        <meshBasicMaterial color={'#08979c'} />
      </Text3D>
      <Line
        ref={lineRef}
        points={[source, dest.from]}
        color={'#87e8de'}
        opacity={0.3}
        transparent={true}
      />
      <mesh
        ref={bookRef}
        position={dest.from}
        onPointerOver={() => onHover()}
        onPointerOut={() => onHoverOut()}
      >
        <boxBufferGeometry args={[0.18, 0.32, 0.05]} />
        <meshPhongMaterial color="#13c2c2" />
      </mesh>
    </>
  );
};
