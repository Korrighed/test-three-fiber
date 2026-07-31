export function MouseTarget({ position = [0, 0, 0], showHelper = false }) {
  return (
    <group position={position}>
      {showHelper && <axesHelper args={[30]} />}
    </group>
  );
}
