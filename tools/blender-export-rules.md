# BLENDER EXPORT RULES
## The Adventures of Lil Artie

---

## Required Steps Before Export

1. **Apply all transforms** — Select all meshes → Object → Apply → All Transforms
2. **Remove doubles** — Edit Mode → Merge by Distance
3. **Check normals** — Overlay → Face Orientation. Blue = correct, Red = flipped (fix with Flip Normals)
4. **Triangulate** — Add Triangulate modifier before export (or enable in export settings)
5. **Name your meshes** — Descriptive names only. No "Cube.001"
6. **Armature** — If rigged: name armature `Armature`, root bone `root`

---

## Export Settings (GLB)

File → Export → glTF 2.0 (.glb/.gltf)

**General**:
- Format: `glTF Binary (.glb)`
- Remember Export Settings: ✅

**Include**:
- Selected Objects: depends on export
- Custom Properties: ✅ (for metadata tags)
- Cameras: ❌
- Punctual Lights: ❌

**Transform**:
- Y Up: ✅ (PlayCanvas uses Y-up)

**Geometry**:
- Apply Modifiers: ✅
- UVs: ✅
- Normals: ✅
- Tangents: ✅
- Vertex Colors: ✅ (if used)
- Materials: ✅

**Animation**:
- Use Current Frame: ❌
- Limit to Playback Range: ✅
- Always Sample Animations: ✅
- NLA Strips: ✅ (for multiple animations in one GLB)

---

## Material Setup in Blender

Use **Principled BSDF** shader for all materials. PlayCanvas maps these to PBR:

| Blender Input | Maps to |
|---|---|
| Base Color | Albedo/Diffuse |
| Metallic | Metallic |
| Roughness | Roughness |
| Normal Map | Normal |
| Emission | Emissive |

**Do NOT use:**
- Cycles-only nodes (Subsurface with complex graphs)
- EEVEE-only shaders
- Non-principled BSDF setups (use only on special approval)

---

## Mesh Tagging for Game Logic

Meshes that need game behavior should use **Custom Properties** in Blender (Object Properties → Custom Properties).

| Property Name | Value | Purpose |
|---|---|---|
| `climbable` | `true` | Wall climbing detection |
| `swingPoint` | `true` | Whip latch target |
| `waterVolume` | `true` | Swimming trigger |
| `caveEntrance` | `true` | Scene transition trigger |
| `interactable` | `true` | Interact prompt trigger |

These custom properties are exported in the GLB and can be read by the game after import.

---

## Character Armature Convention

```
Armature (root)
└── root (root bone — stays at origin)
    └── pelvis
        ├── spine
        │   ├── chest
        │   │   ├── shoulder_L
        │   │   │   └── arm_L → forearm_L → hand_L
        │   │   ├── shoulder_R
        │   │   │   └── arm_R → forearm_R → hand_R
        │   │   └── neck → head
        ├── hip_L → thigh_L → shin_L → foot_L
        └── hip_R → thigh_R → shin_R → foot_R
```

---

## Animation Names

Name animations exactly as follows for the code to use them:

| Animation Name | Description |
|---|---|
| `idle` | Standing idle |
| `walk` | Walking cycle |
| `run` | Running cycle |
| `jump_start` | Jump initiation |
| `jump_loop` | In-air loop |
| `jump_land` | Landing |
| `climb` | Climbing loop |
| `attack_primary_1` | First slash |
| `attack_primary_2` | Second slash |
| `attack_primary_3` | Third slash |
| `attack_secondary` | Power attack |
| `throw` | Boomerang throw |
| `defeat` | Taking fatal hit |
| `interact` | Picking up / opening |
