import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getConicalSpiral } from '@/utils';

export function Rig({ v = new THREE.Vector3() }) {
  return useFrame((state) => {
    const t = Math.PI - state.clock.elapsedTime * 0.65;
    if (t < -0.25) {
      // const { x, y, z } = state.camera.position;
      // state.camera.position.lerp(v.set(x, state.mouse.y / 2 + 0.35, z), 0.05);
    } else {
      const [x, y, z] = getConicalSpiral(t, 6.8, 4);
      state.camera.position.lerp(v.set(x, y, z), 0.5);
    }
  });
}
