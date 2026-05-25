# TRAVERSAL SYSTEM
## The Adventures of Lil Artie

---

## Philosophy

Movement in Lil Artie should feel athletic and expressive. Artie is a climber, a swimmer, a glider. The environment is designed to be traversed — not just walked through.

Every traversal ability also has a combat application.

---

## Core Movement

### Walk / Run
- Walk: moderate speed, no stamina drain
- Run: fast, drains stamina over time
- Running into a wall = automatic ledge check (see below)

### Jump
- Standard jump from ground
- Coyote time: 0.12 seconds of grace after leaving a ledge
- Can trigger jump while running for longer horizontal distance
- Double jump: NOT included (keep it grounded)

### Dodge
- Quick roll in any direction (left stick + dodge button)
- Brief invincibility window
- Costs stamina
- Works on ground only (no air dodge in MVP)

---

## Advanced Traversal

### Wall Climbing
- Artie can climb surfaces tagged as `climbable` (vines, rough stone, wooden walls)
- Face the wall and hold climb input
- Stamina drains while climbing
- At top: auto-vault over ledge
- Climb must end: either vault, jump off, or fall

### Ledge Grab
- When airborne near a ledge edge, Artie auto-grabs
- Press jump to vault up, or drop to let go
- Can shimmy left/right (future)
- Stamina cost: holding a ledge drains slowly

### Gliding
- Unlocked by finding glider item in world (already in inventory for MVP)
- Activate in air: press jump button while falling
- Glide forward at controlled speed, slow descent
- Stamina not required for glide — duration limited by altitude

### Swimming
- Enter water = swim mode
- Horizontal movement: normal speed (slower than land)
- Vertical: press jump to surface, hold dive to go under
- Stamina drains while underwater
- Surface automatically if stamina runs out

### Whip Swing
- Find a `swingPoint` tag in the world (ring bolt, branch, beam)
- Aim at it and use whip secondary attack
- Whip latches, Artie swings on pendulum arc
- Release = launch in arc direction
- High-skill: time the release for maximum distance

---

## Stamina and Traversal

| Action | Stamina Effect |
|---|---|
| Running | Drains 15/sec |
| Climbing | Drains 20/sec |
| Holding ledge | Drains 5/sec |
| Underwater | Drains 10/sec |
| Gliding | No drain |
| Dodge | -15 flat cost |
| Idle / walking | Regens 20/sec (after 1.5s delay) |

Stamina floor: cannot run or climb when at 0.

---

## Fall Damage

- Falls > 15 units/sec vertical velocity on landing = damage
- Damage scales with velocity: 10–40 HP
- Short roll on landing reduces damage by 50% (timing-based — future)
- Landing in water: no fall damage

---

## Traversal Design Principles for Level Design

- Every vertical wall in the game should either be climbable, have a route around, or be a deliberate barrier
- Swing points should be visible to the player (metallic ring, thick branch)
- Water areas should have visible entry points
- Glider areas should show the destination or reward the player visually on approach
