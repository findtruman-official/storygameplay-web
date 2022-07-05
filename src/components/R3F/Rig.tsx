import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { getConicalSpiral } from '@/utils';
import { CanvasLoaded } from '@/pages';
import { useEffect } from 'react';

let CanvasLoadedTime = 0;
export const CameraPosition = new THREE.Vector3();

export function Rig({ v = new THREE.Vector3() }) {
  const scene = useThree();
  useEffect(() => {
    scene.camera.position.lerp(CameraPosition, 0.5);
  }, [scene.camera]);

  return useFrame((state) => {
    if (!CanvasLoaded) {
      return;
    }
    if (!CanvasLoadedTime) {
      CanvasLoadedTime = state.clock.elapsedTime;
    }
    const t = Math.PI / 2 - (state.clock.elapsedTime - CanvasLoadedTime) * 0.65;
    if (t < -0.25) {
      const { x, y, z } = state.camera.position;
      CameraPosition.set(x, y, z);
    } else {
      const [x, y, z] = getConicalSpiral(t, 6.8, 4);
      state.camera.position.lerp(v.set(x, y, z), 0.5);
    }
  });
}
