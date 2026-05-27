# REALISTIC ENVIRONMENT ASSET SOURCES

Current detailed first-land shortlist: [FIRST_LAND_ASSET_PLAN.md](FIRST_LAND_ASSET_PLAN.md).

## Verified GitHub Sources

### KhronosGroup/Vulkan-Samples-Assets

- URL: https://github.com/KhronosGroup/Vulkan-Samples-Assets
- License: selected terrain assets are marked Apache 2.0 in the repo README.
- Use: terrain source, heightmap workflow, terrain texture workflow, rock reference.
- Candidate files: `scenes/terrain/terrain.gltf`, `textures/terrain_heightmap_r16.ktx`, `textures/terrain_texturearray_rgba.ktx`, `scenes/rock.gltf`.

### TheWizardsCode/Terrains

- URL: https://github.com/TheWizardsCode/Terrains
- License: Apache 2.0.
- Use: realistic ground textures, rocks, plants, tree source assets, stone/medieval structures for ruins, camp, and village areas.
- Candidate paths: `Assets/WizardsCode/Terrains/Textures/Assets/OpenSourceTextures/`, `Assets/WizardsCode/Terrains/Models/Assets/OpenSourceModels/Rocks/`, `Assets/WizardsCode/Terrains/Models/Assets/OpenSourceModels/Trees/`, `Assets/WizardsCode/Terrains/Models/Assets/OpenSourceModels/Buildings/Medieval/`.

## Review Only

### redhoot-dev/Godot-Open-World-Demo

- URL: https://github.com/redhoot-dev/Godot-Open-World-Demo
- License: no license found during the GitHub pass.
- Use: review/reference only until license is confirmed.
- Do not import files from this repo yet.

## GitHub Sources To Review

1. ToxSam/open-source-3D-assets
   - URL: https://github.com/ToxSam/open-source-3D-assets
   - Use for: CC0 GLB registry, environment props, ruins, structures.
   - Check: avoid stylized collections; use only realistic or realistic-convertible props.

2. KhronosGroup/glTF-Sample-Assets
   - URL: https://github.com/KhronosGroup/glTF-Sample-Assets
   - Use for: high-quality PBR glTF reference assets and render-validation assets.
   - Check: each asset folder has its own license/credit requirements.

3. Poly Haven API
   - URL: https://polyhaven.com/our-api
   - Use for: CC0 HDRIs, PBR textures, and models.
   - Check: preferred source for realistic terrain materials, rock materials, bark, leaves, sand, dirt, and sky lighting.

4. SaschaWillems/Vulkan
   - URL: https://github.com/SaschaWillems/Vulkan
   - Use for: terrain rendering reference and sample terrain data ideas.
   - Check: use as technical reference, not as direct art import unless license and asset source are verified.

## Asset Direction

- Realistic only.
- No low-poly visible production assets.
- No stylized trees, toon foliage, cartoon props, or placeholder characters.
- Do not add character models until the final Lil Artie, enemy, and NPC character sources are provided.
