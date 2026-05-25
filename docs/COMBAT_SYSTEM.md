# COMBAT SYSTEM
## The Adventures of Lil Artie

---

## Philosophy

Combat in Lil Artie is a tool, not the main event. Exploration is first. When combat happens, it should feel like a physical, grounded confrontation — not a fantasy button-mashing game.

Players should think about:
- Which weapon fits this situation?
- Can I disarm them instead of fighting?
- Can I sneak around this camp?
- Can I trigger a distraction with the boomerang?

---

## Weapons Overview

### Boomerang
**Type**: Ranged, returns to player  
**Primary**: Throw — arcs forward, hits targets, returns  
**Secondary**: Charged throw — faster, more damage  
**Utility**: Hit distant targets, trigger switches, disrupt enemy patrols  
**Stamina cost**: None  
**Cooldown**: None — catch it to throw again  
**Lock-on mechanic**: Hold lock-on button to track a target before throwing

### Dagger
**Type**: Close melee, fast  
**Primary**: Quick slash — 3-hit combo  
**Secondary**: Power stab — slow but high damage  
**Combo timing**: Each hit opens a window for the next; missing the window resets the combo  
**Stamina cost**: Low per hit  
**Best used**: Against one enemy in close range

### Whip
**Type**: Medium range, disarm + stagger  
**Primary**: Crack — damages and stuns briefly  
**Secondary**: Latch — attach to swing point or grab enemy weapon  
**Disarm mechanic**: Secondary on armed enemy = disarm (knockback + weapon drop)  
**Stamina cost**: Medium  
**Best used**: Multiple enemies, disarming dangerous opponents

---

## Enemy Engagement

### Detection
- Enemies have a detection cone (field of view) and radius
- Crouching reduces detection range (future mechanic)
- Noise from combat alerts nearby enemies
- Boomerang throw in a direction away from player can create distraction

### Alert States
1. **Unaware** — patrolling normally
2. **Alert** — heard/saw something, pausing to check
3. **Chasing** — confirmed player position, pursuing
4. **Attacking** — in melee/ranged attack range
5. **Searching** — lost player, sweeping last known location
6. **Defeated** — out of combat

### Enemy Combat Behaviors
- Guards: move in, swing melee weapon, retreat after hit
- Commanders: mix of retreating and pressing advantage
- Ranged enemies (future): maintain distance, dodge incoming attacks
- Group behavior: one engages while another flanks (MVP: basic; later: coordinated)

---

## Hit Feel

- Camera shake on receiving damage
- Brief invincibility flash on Artie after being hit
- Enemies stagger visually on hit (no physics ragdoll in MVP — animation state)
- Defeated enemies: kneel/fall animation, then despawn after 2 seconds

---

## Dodge/Evasion

- Dodge roll in any direction: short invincibility window
- Cannot dodge while attacking (small recovery window)
- Stamina cost: medium
- Dodge into enemy attack window = counter-attack opportunity (future)

---

## Damage Numbers (MVP)

| Source | Damage |
|---|---|
| Boomerang | 20 |
| Dagger slash (per hit) | 12-18 (combo scale) |
| Dagger power stab | 40 |
| Whip crack | 15 |
| Enemy melee (guard) | 15 |
| Enemy melee (commander) | 25 |
| Fall damage (severe) | 10-30 |

Player HP: 100 (MVP)

---

## Non-Lethal Options (Future)

- Stealth takedown behind enemy
- Boomerang to knock enemy unconscious
- Whip to trip and stun without defeat
- These options will matter for quest objectives ("don't harm the villagers")
