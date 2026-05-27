# FIRST LAND ASSET PLAN

## Scope

First land environment assets only. Characters are excluded.

Target look: realistic, grounded, sale-quality adventure environment. No stylized or visible low-poly production assets.

## Use First

### KhronosGroup/Vulkan-Samples-Assets

Repo: https://github.com/KhronosGroup/Vulkan-Samples-Assets  
License status: usable for selected assets. The repo README marks the terrain sample as Apache 2.0.

Use for:
- Terrain source/reference
- Terrain height/texture workflow
- Rock test mesh

Candidate files:
- `scenes/terrain/terrain.gltf`
- `scenes/terrain/LICENSE.md`
- `scenes/terrain/README.md`
- `textures/terrain_heightmap_r16.ktx`
- `textures/terrain_texturearray_rgba.ktx`
- `scenes/rock.gltf`

Notes:
- Convert GLTF/KTX into Babylon-ready GLB and browser textures before runtime use.
- Keep the source license file beside any imported copy.

### TheWizardsCode/Terrains

Repo: https://github.com/TheWizardsCode/Terrains  
License status: usable. Repo license is Apache 2.0.

Use for:
- Ground materials
- Dirt, grass, sand, path, rock textures
- Realistic rocks
- Tree/foliage source assets
- Medieval/stone building source assets for ruins, village test area, and camp structures

Candidate files:
- `Assets/WizardsCode/Terrains/Models/Assets/OpenSourceModels/Rocks/Rock 01/Rock_01.OBJ`
- `Assets/WizardsCode/Terrains/Models/Assets/OpenSourceModels/Rocks/Rock 04/Rock04_LP.OBJ`
- `Assets/WizardsCode/Terrains/Models/Assets/OpenSourceModels/Rocks/Rock 05/Rock05_LP.OBJ`
- `Assets/WizardsCode/Terrains/Models/Assets/OpenSourceModels/Rocks/Rock 07/Rock_07_LP.OBJ`
- `Assets/WizardsCode/Terrains/Models/Assets/OpenSourceModels/Trees/Tree9/Tree9_Leaf.fbx`
- `Assets/WizardsCode/Terrains/Textures/Assets/OpenSourceTextures/Ground/`
- `Assets/WizardsCode/Terrains/Textures/Assets/OpenSourceTextures/Rock/`
- `Assets/WizardsCode/Terrains/Textures/Assets/OpenSourceTextures/Plant/`
- `Assets/WizardsCode/Terrains/Models/Assets/OpenSourceModels/Buildings/Medieval/`

Notes:
- OBJ, FBX, DAE, and BLEND files need Blender cleanup and GLB export.
- Use higher-detail pieces where available. Low-poly files can be collision or distant LOD only.

## Review Only

### redhoot-dev/Godot-Open-World-Demo

Repo: https://github.com/redhoot-dev/Godot-Open-World-Demo  
License status: not usable yet. No repo license was found through the GitHub API, and raw `LICENSE` returned 404.

Potential reference files:
- `Terrain/Terrain.dae`
- `Terrain/Albedo.png`
- `Terrain/NormalMap.png`
- `Terrain/TerrainShadowCaster.obj`
- `Environment/Skies.png`
- `Environment/SkySphere.obj`
- `Environment/FogCylinder.obj`

Decision:
- Do not import these files unless a license is confirmed.
- Can be used only as visual/technical reference during research.

## Reject

- Character assets from any external repo
- CC-BY-NC assets
- Unlicensed assets
- Stylized assets
- Visible low-poly production meshes
- Any copyrighted game assets or copied maps

## First Import Order

1. Import Khronos terrain source files with license into `public/assets/source/first-land/khronos-terrain/`.
2. Convert terrain source into a Babylon-ready GLB or heightmap-driven terrain.
3. Import selected TheWizardsCode ground and rock textures into `public/assets/source/first-land/wizardscode-terrain/`.
4. Convert one rock set and one tree/foliage set into GLB for `public/assets/models/environment/`.
5. Convert one stone/medieval structure set into ruins or camp props for `public/assets/models/props/`.
