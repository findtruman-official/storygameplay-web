import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html, Text3D, useFBX } from '@react-three/drei';
import {
  EffectComposer,
  Outline,
  SelectiveBloom,
  Selection,
  Select,
} from '@react-three/postprocessing';
import Font from '@/assets/fonts/Lato-Regular.json';
import { getConicalSpiral } from '@/utils';
import { StoryModal } from '@/components/StoryModal/StoryModal';
import { StoryData } from '@/utils/data';
import { CatmullRomCurve3 } from 'three';

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
  const [bloomRefs, setBloomRefs] = useState<any[]>([]);
  const [outlineRefs, setOutlineRefs] = useState<any[]>([]);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  useFrame((state) => {
    // if (!hovered) {
    //   storiesRef.current.rotation.y += 0.0005;
    // }
    // TODO: move to Rig
    const t = Math.PI - state.clock.elapsedTime * 0.65;
    if (t < -0.03) return;
    const [x, y, z] = getConicalSpiral(t, 5.4, 4);
    state.camera.position.lerp(new THREE.Vector3(x, y, z), 0.5);
  });

  const fbx = useFBX('BlackLakeBook.FBX');

  return (
    <>
      <CenterPoint />
      <ambientLight ref={lightRef} color={'0xffffff'} />
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
              addBloomRef={(r) => setBloomRefs((state) => [...state, r])}
            />
          ))}

          {StoryData.map((data, index) => (
            <Story
              index={index}
              key={index}
              hovered={hovered}
              cover={data.img}
              fbx={fbx.clone()}
              source={[-2, 0, -2]}
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
              addOutlineRef={(r) => {
                setOutlineRefs((state) => [...state, r]);
              }}
            />
          ))}
          <EffectComposer multisampling={8} autoClear={false}>
            <SelectiveBloom
              lights={[lightRef]}
              selection={bloomRefs}
              kernelSize={5}
              luminanceThreshold={0}
              luminanceSmoothing={0.4}
              intensity={2}
            />
            <Outline
              edgeStrength={6}
              selection={outlineRefs}
              pulseSpeed={0.2}
              visibleEdgeColor={0x13c2c2}
              hiddenEdgeColor={0xffffff}
              kernelSize={1}
              blur={true}
            />
          </EffectComposer>
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

const CenterPoint = () => {
  return (
    <mesh position={[-2, 0, -2]}>
      <sphereGeometry args={[0.05, 64, 64]}>
        <meshBasicMaterial color={'#b5f5ec'} />
      </sphereGeometry>
    </mesh>
  );
};

const Ray = ({
  index,
  hovered,
  name,
  source,
  dest,
  addBloomRef,
}: {
  index: number;
  hovered: boolean;
  name: string;
  source: [number, number, number];
  dest: [number, number, number];
  addBloomRef: (refs: any) => void;
}) => {
  const textRef = useRef<any>();
  const lineRef = useRef<any>();

  useEffect(() => {
    if (lineRef) {
      addBloomRef(lineRef);
    }
  }, [lineRef]);

  useEffect(() => {
    if (textRef) {
      addBloomRef(textRef);
      const geometry = textRef.current.geometry;
      geometry.center();
      const position = textRef.current.position;
      textRef.current.position.set(position.x, position.y + 0.3, position.z);

      textRef.current.lookAt(new THREE.Vector3(0, dest[1], 0));
      textRef.current.rotateY(Math.PI);
    }
  }, [textRef]);

  useFrame((state) => {
    if (hovered) return;

    const t = -state.clock.elapsedTime / 40 + index * RAD;
    textRef.current.position.lerp(
      new THREE.Vector3(
        RADIUS * Math.cos(t),
        dest[1] + 0.3,
        RADIUS * Math.sin(t),
      ),
      0.1,
    );
    textRef.current.lookAt(new THREE.Vector3(0, dest[1], 0));
    textRef.current.rotateY(Math.PI);
    lineRef.current.geometry.setFromPoints([
      new THREE.Vector3(...source),
      new THREE.Vector3(RADIUS * Math.cos(t), dest[1], RADIUS * Math.sin(t)),
    ]);
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
        <meshBasicMaterial color={'#13c2c2'} />
      </Text3D>
      <line ref={lineRef}>
        <bufferGeometry />
        <meshBasicMaterial color={'#87e8de'} opacity={0.8} transparent={true} />
      </line>
    </>
  );
};

const Story = ({
  index,
  hovered,
  cover,
  fbx,
  source,
  dest,
  onClick,
  onHover,
  onHoverOut,
  addOutlineRef,
}: {
  index: number;
  hovered: boolean;
  cover: string;
  fbx: any;
  source: [number, number, number];
  dest: [number, number, number];
  onClick: () => void;
  onHover: () => void;
  onHoverOut: () => void;
  addOutlineRef: (refs: any) => void;
}) => {
  const bookRef = useRef<any>();

  useEffect(() => {
    if (bookRef) {
      addOutlineRef(bookRef);
      bookRef.current.lookAt(new THREE.Vector3(0, dest[1], 0));
      bookRef.current.rotateX(-Math.PI / 2);
      bookRef.current.rotateY(Math.PI);
    }
  }, [bookRef]);

  useFrame((state) => {
    if (hovered) return;
    const t = -state.clock.elapsedTime / 40 + index * RAD;
    bookRef.current.position.lerp(
      new THREE.Vector3(RADIUS * Math.cos(t), dest[1], RADIUS * Math.sin(t)),
      0.1,
    );
    // bookRef.current.lookAt(new THREE.Vector3(0, dest[1], 0));
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
        <primitive object={fbx} scale={[1, 1, 1]} dispose={null} />
      </mesh>
    </Select>
  );
};
