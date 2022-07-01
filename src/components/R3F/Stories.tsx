import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html, Line, Text3D, useFBX, useGLTF } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import Font from '@/assets/fonts/Lato-Regular.json';
import { getConicalSpiral } from '@/utils';
import { StoryModal } from '@/components/StoryModal/StoryModal';
import { StoryData } from '@/utils/data';

interface Props {
  position?: [x: number, y: number, z: number];
}

const RADIUS = 5;
const COUNT = StoryData.length;
const RAD = (2 * Math.PI) / COUNT;
const points: [number, number, number][] = new Array(COUNT)
  .fill(0)
  .map((_, index) => {
    const x = RADIUS * Math.cos(RAD * index);
    const z = RADIUS * Math.sin(RAD * index);
    return [x, 1, z];
  });

export const Stories: React.FC<Props> = ({ position = [0, 0, 0] }) => {
  const storiesRef = useRef<any>();

  const [hovered, setHovered] = useState(false);
  const [storyData, setStoryData] = useState<any>();
  const [storyModalVisible, setStoryModalVisible] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  useFrame((state) => {
    if (!hovered) {
      storiesRef.current.rotation.y += 0.001;
    }
    // TODO: move to Rig
    const t = Math.PI - state.clock.elapsedTime * 0.65;
    if (t < -Math.PI / 14) return;
    const [x, y, z] = getConicalSpiral(t, 9, 5);
    state.camera.position.lerp(new THREE.Vector3(x, y, z), 0.5);
  });

  const fbx = useFBX('BlackLakeBook.FBX');

  return (
    <>
      <CenterPoint />
      <group ref={storiesRef}>
        {StoryData.map((data, index) => (
          <Story
            key={index}
            name={data.name}
            cover={data.img}
            fbx={fbx.clone()}
            source={[0, 0, 0]}
            dest={points[index]}
            onClick={() => {
              if (data.url) {
                window.open(data.url, '_blank', 'noreferrer noopener');
              } else {
                setStoryData(data);
                setStoryModalVisible(true);
              }
            }}
            onHover={() => setHovered(true)}
            onHoverOut={() => {
              setHovered(false);
            }}
          />
        ))}
        {/*<EffectComposer multisampling={8}>*/}
        {/*  <Bloom*/}
        {/*    kernelSize={3}*/}
        {/*    luminanceThreshold={0}*/}
        {/*    luminanceSmoothing={0.4}*/}
        {/*    intensity={0.6}*/}
        {/*  />*/}
        {/*</EffectComposer>*/}
      </group>
      <Html center>
        <StoryModal
          data={storyData}
          visible={storyModalVisible}
          onClose={() => setStoryModalVisible(false)}
        />
      </Html>
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

const Story = ({
  name,
  cover,
  fbx,
  source,
  dest,
  onClick,
  onHover,
  onHoverOut,
}: {
  name: string;
  cover: string;
  fbx: any;
  source: [number, number, number];
  dest: [number, number, number];
  onClick: () => void;
  onHover: () => void;
  onHoverOut: () => void;
}) => {
  const textRef = useRef<any>();
  const lineRef = useRef<any>();
  const bookRef = useRef<any>();

  useEffect(() => {
    if (textRef) {
      const geometry = textRef.current.geometry;
      geometry.center();
      const position = textRef.current.position;
      textRef.current.position.set(position.x, position.y + 0.3, position.z);

      textRef.current.lookAt(new THREE.Vector3(0, dest[1], 0));
      textRef.current.rotateY(Math.PI);
    }
  }, []);

  useEffect(() => {
    if (bookRef) {
      bookRef.current.lookAt(new THREE.Vector3(0, dest[1], 0));
      bookRef.current.rotateX(-Math.PI / 2);
      bookRef.current.rotateY(Math.PI);
    }
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (lineRef && t >= 3 && t <= 5.01) {
      const geometry = lineRef.current.geometry;
      geometry.setFromPoints([
        new THREE.Vector3(...source),
        new THREE.Vector3(
          (dest[0] * (t - 3)) / 2,
          (dest[1] * (t - 3)) / 2,
          (dest[2] * (t - 3)) / 2,
        ),
      ]);
    }
  });

  return (
    <>
      {/*//@ts-ignore*/}
      <Text3D
        ref={textRef}
        font={Font}
        size={0.05}
        height={0.01}
        position={dest}
      >
        {name}
        <meshBasicMaterial color={'#08979c'} />
      </Text3D>
      <line ref={lineRef}>
        <bufferGeometry />
        <meshBasicMaterial color={'#87e8de'} opacity={0.3} transparent={true} />
      </line>
      <mesh
        ref={bookRef}
        onClick={() => onClick()}
        onPointerOver={() => onHover()}
        onPointerOut={() => onHoverOut()}
        position={dest}
        material-metalness={0}
        material-roughness={1}
      >
        <primitive object={fbx} scale={[1, 1, 1]} dispose={null} />
      </mesh>
    </>
  );
};
