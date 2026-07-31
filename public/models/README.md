# Modèles 3D

Placer vos fichiers `.glb` dans ce dossier.

## Modèles attendus

### Sans animations
- `tree.glb` : arbre statique
- `rock.glb` : rocher statique

### Avec animations
- `character.glb` : personnage avec animations (animation nommée `Armature|Action` ou `Idle`)

## Comment créer/obtenir des modèles GLB

1. **Blender** : Exporter en `.glb` (File > Export > glTF 2.0)
2. **Sketchfab** : Télécharger les modèles en `.glb`
3. **Unity** : Exporter les modèles en `.glb`

## Vérifier les animations

Ouvrir un fichier GLB dans [glTF Viewer](https://gltf-viewer.donmccurdy.com/) pour voir les noms d'animations.

Modifier le nom dans `Scene.jsx:onClicked()` si nécessaire.
