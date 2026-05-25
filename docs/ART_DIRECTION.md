# ART DIRECTION
## The Adventures of Lil Artie

---

## Visual Identity

The game should look like a **high-quality animated feature film** in real-time 3D. Think vivid colors, strong silhouettes, stylized realism (not photorealistic, not cartoon).

References (mood, not copied):
- Lush jungle environments — dense greens, filtered light
- Sun-blasted desert — pale oranges, deep shadows
- Coastal blues — bright sky, turquoise water
- Underground ruins — torchlight, warm amber, ancient stone

---

## Color Palette per Biome

### Jungle Island
- Primary: Deep greens, earthy browns, bright filtered sunlight
- Accent: Warm gold (treasure, ancient metal), bright red (danger, flowers)
- Shadows: Rich teal-green

### Desert Canyon
- Primary: Warm ochre, pale bone, deep shadow orange
- Accent: Dusty teal (pottery, cloth), bright white (sun reflection)
- Shadows: Cool purple-grey

### Mountain Pass
- Primary: Cool grey-blue stone, white snow, dark pine green
- Accent: Warm orange fire/torchlight
- Shadows: Deep navy

### Coastal Village
- Primary: Turquoise water, warm sand, white plaster walls
- Accent: Vibrant textiles (red, yellow, indigo), fishing net brown
- Shadows: Warm golden shadow

---

## Character Art

### Lil Artie
- Style: Stylized realism — proportion is realistic, but materials are slightly stylized
- Skin: Rich deep brown with PBR shading — not flat
- Hair: Dreadlocks with geometry (not alpha cards for MVP — real mesh)
- Clothing: Worn, real materials — faded fabric, cracked leather

### NPCs
- Each NPC should have a distinct silhouette
- Elder Kwame: tall, robed, slow movement
- Guards: practical military clothing, helmet, weapon visible on back

### Enemies
- Readable at a glance: Blackthorn gear = tactical vest, dark colors
- Sand Wolves: wrapped cloth, desert tones, bow visible
- Ruin Seekers: mismatched explorer gear

---

## Environment Art

### Key Principles
1. **Readable silhouettes** — player can identify climbable surfaces, enemies, and interactables from a distance
2. **Layered depth** — foreground detail, midground play space, background atmosphere
3. **Lived-in world** — environments look like people use them (fire pits, scattered tools, worn paths)
4. **Natural lighting** — ambient occlusion, directional shadows from sun

### Climbable Surfaces
- Vines: lush green, visible hanging
- Stone walls: rough texture, visible cracks/holds
- Wooden structures: planks with visible grain

### Treasure Chests
- Old wood, iron fittings, slightly glowing (ambient light effect) when near quest-relevant
- Opened state: lid slightly open, interior dim

---

## Lighting

- **Primary light**: Directional sun — moves with day/night cycle
- **Secondary**: Hemisphere ambient — softens shadows
- **Accent**: Point lights for torches, fire, glowing artifacts
- **No baked lighting in MVP** — dynamic only

---

## Asset Technical Specs

| Type | Format | Target Triangles | Texture |
|---|---|---|---|
| Main character | GLB | 8,000-12,000 tris | 2K PBR |
| NPCs | GLB | 4,000-8,000 tris | 1K PBR |
| Enemies | GLB | 4,000-8,000 tris | 1K PBR |
| Props (small) | GLB | 200-1,000 tris | 512 atlas |
| Environment (large) | GLB | Up to 30,000 tris | 2K PBR |
| Terrain | Procedural/Heightmap | N/A | 2K tiling |
