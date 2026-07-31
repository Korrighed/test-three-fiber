# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Types d'éclairage Three.js

Récapitulatif des lumières disponibles en Three.js / React Three Fiber (`<xxxLight>`), utilisées ou utilisables dans ce projet.

| Type | Balise R3F | Comportement | Cas d'usage |
|---|---|---|---|
| Ambient | `<ambientLight>` | Éclaire uniformément toute la scène, sans direction ni ombre. | Lumière de base pour éviter le noir total. |
| Directional | `<directionalLight>` | Rayons parallèles, comme le soleil ; a une position et une cible (`target`). | Éclairage extérieur global, ombres portées longues. |
| Point | `<pointLight>` | Rayonne dans toutes les directions depuis un point, s'atténue avec la distance (`decay`). | Ampoule, bougie, source ponctuelle. |
| Spot | `<spotLight>` | Cône de lumière depuis un point, avec `angle` et `penumbra` (flou du bord). | Projecteur, lampadaire, spot de scène. |
| Hemisphere | `<hemisphereLight>` | Dégradé entre une couleur de ciel et une couleur de sol. | Éclairage extérieur naturel, lumière ambiante réaliste. |
| Rect Area | `<rectAreaLight>` | Émet depuis une surface rectangulaire plate, dans une seule direction (axe -Z local). Nécessite `RectAreaLightUniformsLib.init()`. | Néon, panneau lumineux, enseigne de vitrine — utilisé dans `LightEmpty.jsx` pour l'éclairage de la devanture. |

**Source** : [Three.js Manual — Lights](https://threejs.org/manual/#en/lights) et [Three.js Docs — Light](https://threejs.org/docs/#api/en/lights/Light)
