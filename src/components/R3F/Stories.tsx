import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html, Text3D, useFBX } from '@react-three/drei';
import { Selection, Select } from '@react-three/postprocessing';
import Font from '@/assets/fonts/Lato-Regular.json';
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
    return [x, 0, z];
  });

export const Stories: React.FC<Props> = ({ position = [0, 0, 0] }) => {
  const storiesRef = useRef<any>();
  const lightRef = useRef<any>();

  const [hovered, setHovered] = useState(false);
  const [storyData, setStoryData] = useState<any>();
  const [storyModalVisible, setStoryModalVisible] = useState(false);

  const BlackLake = useFBX('./BlackLake.FBX');
  const Metaverse = useFBX('./Metaverse.FBX');
  const Church = useFBX('./Church.FBX');
  const PoliceStation = useFBX('./PoliceStation.FBX');
  const Hospital = useFBX('./Hospital.FBX');
  const Beelzebub = useFBX('./Beelzebub.FBX');
  const SevenDeadlySins = useFBX('./SevenDeadlySins.FBX');

  const fbx = useMemo(
    () => ({
      BlackLake,
      Metaverse,
      Church,
      PoliceStation,
      Hospital,
      Beelzebub,
      SevenDeadlySins,
    }),
    [
      BlackLake,
      Metaverse,
      Church,
      PoliceStation,
      Hospital,
      Beelzebub,
      SevenDeadlySins,
    ],
  );

  const ambientLight = useMemo(() => new THREE.Color(0xffffff), []);

  return (
    <>
      <ambientLight ref={lightRef} color={ambientLight} />
      <group ref={storiesRef}>
        <Selection enabled={true}>
          {points.map((p, index) => (
            <Ray
              index={index}
              key={index}
              hovered={hovered}
              name={StoryData[index].name}
              source={[-2, 0, -2]}
              dest={p}
            />
          ))}

          {StoryData.map((data, index) => (
            <Story
              index={index}
              key={index}
              hovered={hovered}
              // @ts-ignore
              fbx={fbx[data.id]?.clone()}
              source={[-2, 0, -2]}
              dest={points[index]}
              onClick={() => {
                setStoryData(data);
                setStoryModalVisible(true);
              }}
              onHover={() => setHovered(true)}
              onHoverOut={() => {
                setHovered(false);
              }}
            />
          ))}
        </Selection>
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
const Ray = ({
  index,
  hovered,
  name,
  source,
  dest,
}: {
  index: number;
  hovered: boolean;
  name: string;
  source: [number, number, number];
  dest: [number, number, number];
}) => {
  const textRef = useRef<any>();

  useEffect(() => {
    if (textRef) {
      const geometry = textRef.current.geometry;
      geometry.center();
      const position = textRef.current.position;
      textRef.current.position.set(position.x, position.y + 0.9, position.z);

      textRef.current.lookAt(new THREE.Vector3(0, dest[1], 0));
      textRef.current.rotateY(Math.PI);
    }
  }, [textRef]);

  useFrame((state) => {
    if (hovered) return;

    const t = -state.clock.elapsedTime / 35 + index * RAD;
    textRef.current.position.lerp(
      new THREE.Vector3(
        RADIUS * Math.cos(t),
        dest[1] + 0.9,
        RADIUS * Math.sin(t),
      ),
      0.1,
    );
    textRef.current.lookAt(new THREE.Vector3(0, dest[1] + 0.9, 0));
    textRef.current.rotateY(Math.PI);
  });

  return (
    <>
      <Text3D
        ref={textRef}
        //@ts-ignore
        font={Font}
        size={0.15}
        height={0.03}
        position={dest}
      >
        {name}
        <meshPhongMaterial color={'#2b4acb'} />
      </Text3D>
    </>
  );
};

const Story = ({
  index,
  hovered,
  fbx,
  source,
  dest,
  onClick,
  onHover,
  onHoverOut,
}: {
  index: number;
  hovered: boolean;
  fbx: any;
  source: [number, number, number];
  dest: [number, number, number];
  onClick: () => void;
  onHover: () => void;
  onHoverOut: () => void;
}) => {
  const bookRef = useRef<any>();

  useEffect(() => {
    if (bookRef) {
      bookRef.current.lookAt(new THREE.Vector3(0, dest[1], 0));
      bookRef.current.rotateX(-Math.PI / 2);
      bookRef.current.rotateY(Math.PI);
    }
  }, [bookRef]);

  useFrame((state) => {
    if (hovered) return;
    const t = -state.clock.elapsedTime / 35 + index * RAD;
    bookRef.current.position.lerp(
      new THREE.Vector3(RADIUS * Math.cos(t), dest[1], RADIUS * Math.sin(t)),
      0.1,
    );
    bookRef.current.lookAt(new THREE.Vector3(0, dest[1], 0));
  });

  return (
    <Select enabled={true}>
      <mesh
        ref={bookRef}
        onClick={() => onClick()}
        onPointerOver={() => onHover()}
        onPointerOut={() => onHoverOut()}
        position={dest}
        material-metalness={0}
        material-roughness={1}
      >
        <primitive object={fbx} scale={[1.3, 1.3, 1.3]} dispose={null} />
      </mesh>
    </Select>
  );
};
