import { useEffect } from 'react';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

export function LightEmpty({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 10,
  height = 10,
  showHelper = false,
}) {
  useEffect(() => {
    RectAreaLightUniformsLib.init();
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {showHelper && <axesHelper args={[30]} />}
      <rectAreaLight width={width} height={height} intensity={5} color="#ffffff" />
    </group>
  );
}
