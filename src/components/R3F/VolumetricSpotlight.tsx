import { extend, useFrame, useThree } from '@react-three/fiber';
import React, { forwardRef, useEffect } from 'react';
import * as THREE from 'three';
import VolumetricSpotlightMaterial from '@/components/R3F/VolumetricSpotlightMaterial';

extend({
  VolumetricSpotlight: VolumetricSpotlightMaterial,
});

interface Props {
  angle?: number;
  penumbra?: number;
  distance?: number;
  color: string;
  intensity: number;
  position: [x: number, y: number, z: number];
  target: any;
}

const VolumetricSpotlightFunc: React.ForwardRefRenderFunction<any, Props> = (
  props,
  ref,
) => {
  const vs = React.useRef<any>();
  const spotlight = React.useRef<any>();

  const { scene } = useThree();

  const {
    angle = 0.3,
    penumbra = 0.1,
    distance = 60,
    color,
    intensity,
    position,
    target,
  } = props;

  useEffect(() => {
    scene.add(spotlight.current.target);

    const geometry = vs.current.geometry;

    geometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(
        0,
        -geometry.parameters.height / 2,
        0,
      ),
    );
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));

    vs.current.material.uniforms.spotPosition.value = vs.current.position;
    vs.current.rotation.x = -Math.PI / 2;

    spotlight.current.position.copy(vs.current.position);
  }, [scene, color, position]);

  useFrame(({ clock }) => {
    spotlight.current.position.copy(vs.current.position);
    vs.current.material.uniforms.lightColor.value = spotlight.current.color;

    if (target && target.current) {
      vs.current.lookAt(target.current.position);
      spotlight.current.target.position.copy(target.current.position);
    }
  });

  const setRef = React.useCallback(function setRef(el: any) {
    vs.current = el;

    if (ref) {
      // @ts-ignore
      ref.current = el;
    }
  }, []);

  useFrame(() => {
    const angle = spotlight.current.angle;
    vs.current.scale.set(6 * angle, 6 * angle, 1);
  });

  return (
    <>
      <spotLight
        castShadow
        ref={spotlight}
        intensity={intensity}
        angle={angle}
        penumbra={penumbra}
        distance={distance}
        color={color}
        power={10}
        decay={2}
      />

      <mesh ref={setRef} position={position}>
        <coneGeometry args={[20, 80, 64, 64, true]} attach="geometry" />
        {/*<a.coneGeometry args={[10, 40, 64, 30, true]} attach="geometry" />*/}
        {/*// @ts-ignore*/}
        <volumetricSpotlight
          attach="material"
          uniforms-lightColor-value={color}
          uniforms-attenuation-value={24}
          uniforms-anglePower-value={8}
        />
      </mesh>
    </>
  );
};

const VolumetricSpotlight = forwardRef(VolumetricSpotlightFunc);

export default VolumetricSpotlight;
