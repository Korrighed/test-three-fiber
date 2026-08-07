import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { useControls, folder, button } from 'leva';
import { Environment } from './Environment';
import { AnimatedModel } from './AnimatedModel';
import { LightEmpty } from './LightEmpty';
import { CameraEmpty } from './CameraEmpty';
import { MouseTarget } from './MouseTarget';

const environmentPath = '/models/modular_environment.glb';
const animatedModelPath = '/models/personnage1.glb';
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
  const [dropKey, setDropKey] = useState(0);

  const {
    ePosX, ePosY, ePosZ, eScale,
    aScale,
    cPosX, cPosY, cPosZ, cFov,
    mtPosX, mtPosY, mtPosZ, mtShowHelper,
    lPosX, lPosY, lPosZ, lRotX, lRotY, lRotZ, lWidth, lHeight, lShowHelper,
    bEnabled, bIntensity, bLuminanceThreshold, bLuminanceSmoothing, bMipmapBlur, bRadius,
    pDropX, pDropY, pDropZ, pGravityY, pDebug,
    cColW, cColH, cColD, cColOffX, cColOffY, cColOffZ,
  } = useControls({
    Physics: folder({
      Spawn: folder({
        pDropX: { value: -30, min: -500, max: 500, step: 1 }, // position X de depart du personnage (independante de sa position finale)
        pDropY: { value: 401, min: -500, max: 800, step: 1 }, // position Y de depart, en hauteur pour laisser tomber le personnage
        pDropZ: { value: -210, min: -500, max: 500, step: 1 }, // position Z de depart, decalee de la devanture pour ne pas la percuter en tombant
      }),
      pGravityY: { value: -1320, min: -2000, max: 0, step: 10 }, // force de gravite (echelle de la scene, pas -9.81 realiste)
      pDebug: { value: false }, // affiche les colliders Rapier en wireframe
      pReset: button(() => setDropKey((k) => k + 1)), // relance la chute en remontant le RigidBody du personnage
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
    Bloom: folder({
      bEnabled: { value: true }, // monte/demonte <EffectComposer> entierement
      bIntensity: { value: 2.8, min: 0, max: 10, step: 0.1 }, // force du halo ajoute
      bLuminanceThreshold: { value: 0.83, min: 0, max: 1, step: 0.01 }, // luminance mini d'un pixel pour declencher le bloom
      bLuminanceSmoothing: { value: 0.765, min: 0, max: 1, step: 0.01 }, // adoucit la transition autour du seuil (evite un bord dur)
      bMipmapBlur: { value: false }, // flou via mipmaps (moins couteux, plus doux) vs flou gaussien classique
      bRadius: { value: 0.63, min: 0, max: 1, step: 0.01 }, // etalement/portee du flou du halo
    }),
    Environment: folder({
      ePosX: { value: 0, min: -500, max: 500, step: 1 },
      ePosY: { value: 0, min: -500, max: 500, step: 1 },
      ePosZ: { value: 0, min: -500, max: 500, step: 1 },
      eScale: { value: 1, min: 0.1, max: 200, step: 1 },
    }),
    AnimatedModel: folder({
      aScale: { value: 100, min: 1, max: 500, step: 1 }, // position geree par le RigidBody (Physics > Spawn)
      Collider: folder({
        cColW: { value: 40, min: 1, max: 300, step: 1 }, // largeur de la boite de collision (mesh de l'asset non fiable pour un hull auto)
        cColH: { value: 90, min: 1, max: 300, step: 1 }, // hauteur de la boite de collision
        cColD: { value: 30, min: 1, max: 300, step: 1 }, // profondeur de la boite de collision
        cColOffX: { value: 0, min: -100, max: 100, step: 1 }, // decalage de la boite par rapport a l'origine du RigidBody
        cColOffY: { value: 45, min: -100, max: 200, step: 1 },
        cColOffZ: { value: 0, min: -100, max: 100, step: 1 },
      }),
    }),
    Camera: folder({
      cPosX: { value: 435, min: -500, max: 500, step: 1 },
      cPosY: { value: 284, min: -500, max: 500, step: 1 },
      cPosZ: { value: 45, min: -500, max: 500, step: 1 },
      cFov: { value: 80, min: 10, max: 120, step: 1 },
    }),
    MouseTarget: folder({
      mtPosX: { value: 52, min: -500, max: 500, step: 1 },
      mtPosY: { value: -28, min: -500, max: 500, step: 1 },
      mtPosZ: { value: -340, min: -500, max: 500, step: 1 },
      mtShowHelper: { value: true },
    }),
  });

  return (
    <>
      <Physics gravity={[0, pGravityY, 0]} debug={pDebug}>
        <RigidBody type="fixed" colliders="trimesh" position={[ePosX, ePosY, ePosZ]}>
          <Environment path={environmentPath} scale={eScale} />
        </RigidBody>

        <RigidBody
          key={dropKey}
          type="dynamic"
          colliders={false}
          position={[pDropX, pDropY, pDropZ]}
          enabledRotations={[false, false, false]}
        >
          <CuboidCollider
            args={[cColW / 2, cColH / 2, cColD / 2]}
            position={[cColOffX, cColOffY, cColOffZ]}
          />
          <AnimatedModel path={animatedModelPath} scale={aScale} />
        </RigidBody>
      </Physics>
      <LightEmpty
        position={[lPosX, lPosY, lPosZ]}
        rotation={[lRotX * DEG2RAD, lRotY * DEG2RAD, lRotZ * DEG2RAD]}
        width={lWidth}
        height={lHeight}
        showHelper={lShowHelper}
      />
      <CameraEmpty position={[cPosX, cPosY, cPosZ]} fov={cFov} />
      <MouseTarget position={[mtPosX, mtPosY, mtPosZ]} showHelper={mtShowHelper} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />

      <OrbitControls target={[mtPosX, mtPosY, mtPosZ]} />

      {bEnabled && (
        <EffectComposer>
          <Bloom
            intensity={bIntensity}
            luminanceThreshold={bLuminanceThreshold}
            luminanceSmoothing={bLuminanceSmoothing}
            mipmapBlur={bMipmapBlur}
            radius={bRadius}
          />
        </EffectComposer>
      )}
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
          <Canvas style={{ display: loading ? 'none' : 'block' }}>
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
