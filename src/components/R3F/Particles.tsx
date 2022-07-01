import React, { useMemo, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { BoxBufferGeometry } from 'three';
import * as THREE from 'three';

export const Particles = () => {
  const mesh = useRef<any>();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  // const bookTexture = useLoader(THREE.TextureLoader, BookTexture);
  const bookTexture1 = useLoader(THREE.TextureLoader, 'BlackLake.png');

  const geometry = useMemo(() => new BoxBufferGeometry(1, 1, 1), []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    const r = 40;
    const getY = (x: number) => {
      return -x + r;
    };

    for (let i = 0; i < 200; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.005;

      const xR = Math.random() * r;
      const xFactor =
        Math.floor(Math.random() * 10) % 2 === 0
          ? -Math.random() * xR
          : Math.random() * xR;

      const zR = Math.sqrt(r * r - xFactor * xFactor);
      const zFactor =
        Math.floor(Math.random() * 10) % 2 === 0
          ? -Math.random() * zR
          : Math.random() * zR;

      const yR = getY(Math.sqrt(xFactor * xFactor + zFactor * zFactor));
      const yFactor = Math.random() * yR - 18;

      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, []);

  useFrame((state) => {
    mesh.current.rotation.y += 0.001;

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      // There is no sense or reason to any of this, just messing around with trigonometric functions
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      // Update the dummy object
      dummy.position.set(
        particle.mx / 10 + xFactor,
        particle.my / 10 + yFactor + Math.sin((t / 10) * factor),
        particle.my / 10 + zFactor,
      );
      // dummy.scale.set(s, s, s);
      dummy.rotation.set(0, i % 2 === 0 ? -s * 10 : s * 10, 0);
      dummy.updateMatrix();
      // And apply the matrix to the instanced item
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={mesh} args={[geometry, undefined, 200]}>
        <boxBufferGeometry args={[0.25, 0.5, 0.05]} />
        <meshPhongMaterial map={bookTexture1} />
      </instancedMesh>
    </>
  );
};
