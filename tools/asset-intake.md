# Asset Intake

## Style

- Stylized 3D adventure
- Low-to-mid poly
- Strong silhouettes
- Warm jungle, coastal, ruin, and village colors
- Clean PBR-light materials
- Avoid photoreal assets unless they are restyled

## First Asset Slots

Place files here with these names:

- `public/assets/models/characters/lil-artie.glb`
- `public/assets/models/weapons/boomerang.glb`
- `public/assets/models/weapons/dagger.glb`
- `public/assets/models/weapons/whip.glb`

The active PlayCanvas runtime auto-loads these files when present and falls back to placeholders when missing.

## Workflow

1. Generate or buy the asset.
2. Open it in Blender.
3. Check scale, pivot, material names, texture links, and polygon count.
4. Export as `.glb`.
5. Place it in the matching `public/assets/models/` folder.
6. Test it in the PlayCanvas scene.

## Purchased Asset Checks

- Confirm commercial game license
- Prefer `.glb` or `.gltf`
- Keep texture paths embedded or next to the model
- Avoid very high-poly models
- Avoid mixed art styles
- Normalize scale in Blender before export
- Export with transforms applied
