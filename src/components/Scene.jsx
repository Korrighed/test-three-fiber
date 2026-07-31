import { Suspense, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useControls, folder } from 'leva';
import { Environment } from './Environment';
import { AnimatedModel } from './AnimatedModel';

const environmentPath = 'public/models/modular_environment.glb';
const animatedModelPath = 'public/models/personnage1.glb';

function PreloadModels() {
  useEffect(() => {
    useGLTF.preload(environmentPath);
    useGLTF.preload(animatedModelPath);
  }, []);

  return null;
}

function Loader() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
      zIndex: 9999,
    }}>
      <div style={{ color: '#fff', fontSize: '24px' }}>Chargement des modèles...</div>
    </div>
  );
}

function SceneContent() {
  const { camera } = useThree();
  const {
    ePosX, ePosY, ePosZ, eScale,
    aPosX, aPosY, aPosZ, aScale,
    cPosX, cPosY, cPosZ, cFov,
  } = useControls({
    Environment: folder({
      ePosX: { value: 0, min: -500, max: 500, step: 1 },
      ePosY: { value: 0, min: -500, max: 500, step: 1 },
      ePosZ: { value: 0, min: -500, max: 500, step: 1 },
      eScale: { value: 1, min: 0.1, max: 200, step: 1 },
    }),
    AnimatedModel: folder({
      aPosX: { value: 0, min: -500, max: 500, step: 1 },
      aPosY: { value: 28, min: -500, max: 500, step: 1 },
      aPosZ: { value: -217, min: -500, max: 500, step: 1 },
      aScale: { value: 100, min: 1, max: 500, step: 1 },
    }),
    Camera: folder({
      cPosX: { value: 262, min: -500, max: 500, step: 1 },
      cPosY: { value: 103, min: -500, max: 500, step: 1 },
      cPosZ: { value: 146, min: -500, max: 500, step: 1 },
      cFov: { value: 75, min: 10, max: 120, step: 1 },
    }),
  });

  useEffect(() => {
    camera.position.set(cPosX, cPosY, cPosZ);
    camera.fov = cFov;
    camera.updateProjectionMatrix();
  }, [cPosX, cPosY, cPosZ, cFov, camera]);

  return (
    <>
      <Environment path={environmentPath} position={[ePosX, ePosY, ePosZ]} scale={eScale} />
      <AnimatedModel path={animatedModelPath} position={[aPosX, aPosY, aPosZ]} scale={aScale} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />

      <OrbitControls />
    </>
  );
}

export function Scene() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <header>Théâtre 3D - Scène Interactive</header>

      <div className="scene-container">
        <div className="scene-frame">
          <PreloadModels />
          {loading && <Loader />}
          <Canvas camera={{ position: [0, 5, 15], fov: 75 }} style={{ display: loading ? 'none' : 'block' }}>
            <Suspense fallback={null}>
              <SceneContent />
            </Suspense>
          </Canvas>
        </div>
      </div>

      <footer>© 2026 Théâtre 3D | Cliquez sur le personnage pour l'animer</footer>
    </>
  );
}
