import { Suspense, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useControls, folder } from 'leva';
import { Environment } from './Environment';
import { AnimatedModel } from './AnimatedModel';
import { LightEmpty } from './LightEmpty';

const environmentPath = 'public/models/modular_environment.glb';
const animatedModelPath = 'public/models/personnage1.glb';
const DEG2RAD = Math.PI / 180;

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
    lPosX, lPosY, lPosZ, lRotX, lRotY, lRotZ, lWidth, lHeight, lShowHelper,
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
      cPosX: { value: 320, min: -500, max: 500, step: 1 },
      cPosY: { value: 297, min: -500, max: 500, step: 1 },
      cPosZ: { value: 363, min: -500, max: 500, step: 1 },
      cFov: { value: 80, min: 10, max: 120, step: 1 },
    }),
    LightEmpty: folder({
      Position: folder({
        lPosX: { value: 172, min: -500, max: 500, step: 1 },
        lPosY: { value: 340, min: -500, max: 500, step: 1 },
        lPosZ: { value: -228, min: -500, max: 500, step: 1 },
      }),
      Rotation: folder({
        lRotX: { value: -68, min: -360, max: 360, step: 1 },
        lRotY: { value: 360, min: -360, max: 360, step: 1 },
        lRotZ: { value: 3, min: -360, max: 360, step: 1 },
      }),
      Size: folder({
        lWidth: { value: 265, min: 1, max: 300, step: 1 },
        lHeight: { value: 29, min: 1, max: 300, step: 1 },
      }),
      lShowHelper: { value: true },
    }),
  });

  useEffect(() => {
    camera.position.set(cPosX, cPosY, cPosZ);
    // three.js Camera est une API mutable par design (comme tout Object3D) ;
    // incompatible avec react-hooks/immutability, désactivée volontairement ici.
    // eslint-disable-next-line react-hooks/immutability
    camera.fov = cFov;
    camera.updateProjectionMatrix();
  }, [cPosX, cPosY, cPosZ, cFov, camera]);

  return (
    <>
      <Environment path={environmentPath} position={[ePosX, ePosY, ePosZ]} scale={eScale} />
      <AnimatedModel path={animatedModelPath} position={[aPosX, aPosY, aPosZ]} scale={aScale} />
      <LightEmpty
        position={[lPosX, lPosY, lPosZ]}
        rotation={[lRotX * DEG2RAD, lRotY * DEG2RAD, lRotZ * DEG2RAD]}
        width={lWidth}
        height={lHeight}
        showHelper={lShowHelper}
      />

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
