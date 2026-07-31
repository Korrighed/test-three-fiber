import { PerspectiveCamera } from '@react-three/drei';

export function CameraEmpty({ position = [0, 5, 15], fov = 75 }) {
  return <PerspectiveCamera makeDefault position={position} fov={fov} />;
}
