# ENEMY AI SYSTEM
## The Adventures of Lil Artie

---

## Design Philosophy

Enemies are people. They behave like people: they patrol their territory, they get scared, they investigate suspicious noises, they search for you when they lose track, and they retreat when outmatched.

No mindless aggro. No monstrous charge. Human behavior only.

---

## Enemy Factions

### Blackthorn Syndicate
Corporate mercenaries hired to loot ancient sites. Professional, well-equipped.

- **Motivation**: Paid contract. They don't personally hate Artie — they're just doing a job.
- **Behavior**: Disciplined patrol patterns. Alert others when spotting the player. Have a commander.
- **Strengths**: Good equipment, alert radius is high, group coordination (basic)
- **Weakness**: Follow predictable patrol patterns. If commander is defeated, others get sloppy.

**Unit types (MVP):**
- Jungle Guard — machete, standard patrol
- Camp Commander — armored, charges player on sight

---

### Sand Wolves (Desert biome — future)
Bandit clan operating in the desert. Territorial and aggressive.

- **Motivation**: Protect their routes and water sources.
- **Behavior**: More aggressive alert — shorter patience, faster chase
- **Strengths**: Ranged attackers, high mobility in desert terrain
- **Weakness**: Get overconfident; can be lured apart

---

### Ruin Seekers (Ruins biome — future)
Freelance treasure hunters who turn hostile if threatened.

- **Motivation**: Competing for the same sites as Artie. Not evil, just desperate.
- **Behavior**: Will warn once before attacking. If Artie retreats, they may not chase far.
- **Strengths**: Knowledge of local ruins — they know traps
- **Weakness**: Working alone or in small groups, no coordination

---

## AI State Machine

```
UNAWARE
  ↓ (sees/hears player)
ALERT (pause, look)
  ↓ (confirmed)
CHASE
  ↓ (in range)
ATTACK
  ↓ (player lost)
SEARCH (5 seconds)
  ↓ (no player found)
PATROL
```

Each state has:
- Entry behavior (turn toward threat, call out, etc.)
- Update behavior (move, attack, scan)
- Transition conditions

---

## Detection

| Trigger | Notes |
|---|---|
| Player enters detection radius | Full 360° in current MVP |
| Visual cone (future) | 120° forward arc |
| Noise (future) | Running and combat heard at range |
| Boomerang (future) | Can be thrown away from player as distraction |

Detection radius: 12 units (configurable in GameConfig)

---

## Patrol Behavior

- Patrol path is a loop of Vector3 waypoints
- Default: square path around camp center
- Pause at each waypoint: 1-2 seconds (future — currently immediate)
- Variation: some guards stop and look around randomly (future)

---

## Camp Structure (MVP)

**Jungle Camp Alpha:**
- 3 guards
- Circular patrol around camp center
- Treasure chest is guarded
- No commander in MVP (planned for Jungle Camp Beta)

---

## Combat Behavior

- Guard: walks toward player, swings at attackRange (2 units)
- After being hit: brief stagger, then re-engage
- After 3 consecutive hits without landing one: brief retreat and re-approach (future)
- Defeated: fall animation (2s), then despawn

---

## Implementation Notes for Codex

- HumanEnemy extends EnemyBase
- State machine in `enemyAI.ts`, update() called every frame
- Patrol path set via `enemy.setPatrolPath()`
- `onDefeated` callback fires when health reaches 0
- `onDamageDealt` fires when enemy successfully hits player
- Enemy mesh: capsule placeholder until GLB model available
