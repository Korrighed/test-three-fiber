# TP : Intégration de Modèles 3D avec React Three Fiber

## Objectifs

Créer une application React utilisant **@react-three/fiber** et **@react-three/drei** pour afficher et animer des modèles 3D (fichiers .glb).

## Consignes

### 1. Structure des modèles 3D
- Placer plusieurs fichiers `.glb` **sans animations** dans `public/models/`
- Placer un fichier `.glb` **avec animations** dans `public/models/`

### 2. Composant `Model` (modèles statiques)
- Créer un composant qui utilise `useGLTF` de `@react-three/drei`
- Accepter des **props** pour la position et l'échelle
- Afficher le modèle 3D sans animations

```jsx
// Exemple d'utilisation
<Model
  path="public/models/tree.glb"
  position={[0, 0, 0]}
  scale={1.5}
/>
```

### 3. Composant `AnimatedModel` (modèles avec animations)
- Utiliser `useGLTF` pour charger le modèle
- Utiliser `useAnimations` pour gérer les animations
- Exposer une méthode pour lancer les animations

### 4. Scène `<Canvas>`
- Afficher **plusieurs modèles statiques** à différentes positions avec le composant `Model`
- Ajouter un **sol** (plane) avec texture ou couleur
- Intégrer **l'AnimatedModel** à une position spécifique

### 5. Interaction : Démarrer l'animation
- Ajouter un écouteur d'événement (clic ou autre) sur le modèle animé
- Déclencher l'animation au clic
- Exemple : clic → animation de saut, danse, etc.

### 6. Bonus : Préchargement et écran de chargement
- Utiliser `useGLTF.preload()` pour tous les modèles avant le rendu
- Créer un **écran de chargement** qui affiche la progression
- Masquer l'écran une fois tous les modèles chargés

## Structure de dossiers attendue

```
public/
├── models/
│   ├── tree.glb          (sans animation)
│   ├── rock.glb          (sans animation)
│   ├── character.glb     (avec animation)
│   └── ...

src/
├── components/
│   ├── Model.jsx         (modèle statique)
│   ├── AnimatedModel.jsx (modèle animé)
│   └── Canvas.jsx        (scène 3D)
├── App.jsx
└── main.jsx
```

## Technologie requise

- **React** 18+
- **@react-three/fiber** : intégration React pour Three.js
- **@react-three/drei** : utilitaires (useGLTF, useAnimations, OrbitControls, etc.)
- **three** : moteur 3D (dépendance de fiber)

## Évaluation

- ✅ Modèles 3D affichés correctement
- ✅ Modèles statiques et animés distincts
- ✅ Interaction au clic fonctionnelle
- ✅ Code organisé et réutilisable
- ✅ (Bonus) Écran de chargement avec préchargement

