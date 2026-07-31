import { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

export function AnimatedModel({ path, position = [0, 0, 0], scale = 1, onClicked }) {
  const { scene, animations } = useGLTF(path);
  const group = useRef(null);
  const { actions } = useAnimations(animations, group);

  const playAnimation = (animationName) => {
    if (actions[animationName]) {
      actions[animationName].reset();
      actions[animationName].play();
    }
  };

  useEffect(() => {
    if (animations.length > 0) {
      playAnimation(animations[0].name);
    }
  }, [animations, actions]);

  const handleClick = () => {
    if (onClicked) {
      onClicked(playAnimation);
    } else if (animations.length > 0) {
      playAnimation(animations[0].name);
    }
  };

  return (
    <group ref={group} position={position} scale={scale} onClick={handleClick}>
      <primitive object={scene} />
    </group>
  );
}