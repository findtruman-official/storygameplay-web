import React, { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { BoxBufferGeometry } from 'three';
import * as THREE from 'three';

const TextureUrls = new Array(15)
  .fill(0)
  .map((_, index) => `textures/movie${index + 1}.png`);

export const ParticlesGroup = () => {
  const bookTextures = useLoader(THREE.TextureLoader, TextureUrls);

  return (
    <>
      {bookTextures.map((t, index) => (
        <Particles key={index} texture={t} count={20} />
      ))}
    </>
  );
};

const Particles = ({ texture, count }: { texture: any; count: number }) => {
  const mesh = useRef<any>();

  const geometry = useMemo(() => new BoxBufferGeometry(1, 1, 1), []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    const r = 40;

    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.005;

      const xFactor = -25 + Math.random() * 50;

      const yFactor = -25 + Math.random() * 50;

      const zRange = Math.sqrt(8 * 8 - xFactor * xFactor);

      const zFactor =
        Math.abs(xFactor) <= 8
          ? Math.floor(Math.random() * (50 - zRange + 1)) + zRange
          : -25 + Math.random() * 50;

      temp.push({
        t,
        factor,
        speed,
        xFactor: xFactor,
        yFactor,
        zFactor: Math.floor(Math.random() * 10) % 2 === 0 ? zFactor : -zFactor,
        mx: 0,
        my: 0,
      });
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
      <instancedMesh ref={mesh} args={[geometry, undefined, count]}>
        <boxBufferGeometry args={[0.4, 0.6, 0.05]} />
        <meshBasicMaterial map={texture} />
      </instancedMesh>
    </>
  );
};
