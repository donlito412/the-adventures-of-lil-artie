# ASSET PIPELINE
## The Adventures of Lil Artie

---

## Overview

All 3D assets are created or cleaned in Blender and exported as GLB (binary GLTF) for use in Babylon.js.

---

## Pipeline Steps

```
Blender Model
    ↓
Clean up geometry (remove doubles, apply transforms)
    ↓
Rig & Animate (characters only)
    ↓
Set up PBR materials in Blender (Principled BSDF)
    ↓
Export as GLB (see blender-export-rules.md)
    ↓
Place in correct public/assets/models/ subfolder
    ↓
Test in the local Babylon.js scene before committing to gameplay.
    ↓
Commit GLB to repo (use Git LFS for files > 5MB)
```

---

## Folder Destinations

| Asset Type | Folder |
|---|---|
| Lil Artie character | `public/assets/models/characters/artie.glb` |
| NPCs | `public/assets/models/characters/[npc-name].glb` |
| Enemy types | `public/assets/models/enemies/[type].glb` |
| Weapons | `public/assets/models/weapons/[weapon].glb` |
| Trees, rocks, terrain | `public/assets/models/environment/` |
| Props (chests, crates) | `public/assets/models/props/` |
| Textures | `public/assets/textures/` |
| Animations (separate) | `public/assets/animations/` |

---

## Optimization Targets

| Asset | Max Triangles | Texture Size |
|---|---|---|
| Player character | 12,000 | 2K (2048×2048) |
| NPCs | 8,000 | 1K |
| Enemies | 8,000 | 1K |
| Large environment | 30,000 | 2K |
| Small props | 1,000 | 512 atlas |
| Weapons | 500 | 512 |

---

## Babylon.js Loading

All GLBs are loaded via `AssetLoader.loadModel(path)` which uses `SceneLoader.ImportMeshAsync`.

```typescript
const { meshes, rootMesh } = await assetLoader.loadModel('/assets/models/characters/artie.glb', 'artie');
```

---

## Audio Pipeline

| Format | Use |
|---|---|
| `.mp3` | Background music (compressed) |
| `.ogg` | SFX (better loop support) |
| `.wav` | High-priority SFX source files (not shipped) |

Destination folders:
- `public/assets/audio/music/` — background tracks
- `public/assets/audio/sfx/` — sound effects

Audio loaded via `SfxManager.play(name)` and `MusicManager.play(trackName)`.
