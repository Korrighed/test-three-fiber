import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AnimatedModel } from './AnimatedModel';

export function SwimmingFish({
  path,
  center = [0, 0, 0],
  axis = 'x',
  amplitude = 50, // demi-portee du trajet (distance totale parcourue = amplitude * 2)
  speed = 60, // unites/seconde (pas rad/s : avancement continu, pas une oscillation)
  phase = 0, // decalage de depart sur le trajet, en unites de distance (pas en radians)
  rotation = [0, 0, 0],
  scale = 1,
}) {
  const group = useRef(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const range = amplitude * 2;
    const travelled = (clock.getElapsedTime() * speed + phase) % range;
    const offset = travelled - amplitude; // avance en continu de -amplitude a +amplitude, puis boucle (teleport)
    group.current.position.set(
      center[0] + (axis === 'x' ? offset : 0),
      center[1] + (axis === 'y' ? offset : 0),
      center[2] + (axis === 'z' ? offset : 0),
    );
  });

  return (
    <group ref={group} rotation={rotation}>
      <AnimatedModel path={path} scale={scale} />
    </group>
  );
}