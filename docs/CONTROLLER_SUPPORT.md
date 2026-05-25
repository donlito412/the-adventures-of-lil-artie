# CONTROLLER SUPPORT
## The Adventures of Lil Artie

---

## Supported Devices

| Device | Support Level |
|---|---|
| Xbox Controller (wired/wireless) | Full |
| PlayStation 4/5 Controller | Full |
| Generic Gamepad (Standard Gamepad API) | Full (best effort) |
| Keyboard + Mouse | Full fallback |

---

## Button Mapping

### Xbox Controller

| Button | Action |
|---|---|
| Left Stick | Move |
| Right Stick | Camera |
| A | Jump / Vault / Pull-up |
| X | Primary Attack |
| B | Secondary Attack / Dodge |
| Y | Interact / Use Item |
| LB | Previous Weapon |
| RB | Next Weapon |
| LT (hold) | Run |
| RT (hold) | Lock-on target |
| L3 | Lock-on toggle |
| R3 | Crouch (future) |
| View / Back | Map / Journal |
| Menu / Start | Pause |

### PlayStation Controller

| Button | Action |
|---|---|
| Left Stick | Move |
| Right Stick | Camera |
| ✕ (Cross) | Jump / Vault / Pull-up |
| □ (Square) | Primary Attack |
| ○ (Circle) | Secondary Attack / Dodge |
| △ (Triangle) | Interact / Use Item |
| L1 | Previous Weapon |
| R1 | Next Weapon |
| L2 (hold) | Run |
| R2 (hold) | Lock-on |
| L3 | Lock-on toggle |
| R3 | Crouch (future) |
| Share / Create | Map / Journal |
| Options | Pause |

---

## Keyboard + Mouse

| Key | Action |
|---|---|
| WASD | Move |
| Mouse Move | Camera |
| Mouse Left | Primary Attack |
| Mouse Right | Secondary Attack |
| Space | Jump |
| Shift | Run |
| C | Dodge |
| F | Primary Attack (alt) |
| G | Secondary Attack (alt) |
| E | Next Weapon |
| Q | Previous Weapon |
| T | Interact |
| I or Tab | Inventory |
| M | Map |
| L | Lock-on |
| Escape | Pause |

---

## Implementation Notes

The gamepad system uses the **Standard Gamepad** button layout (index 0-16), which is what Chrome, Firefox, and Edge map all major controllers to:

- Index 0 = A / Cross
- Index 1 = B / Circle
- Index 2 = X / Square
- Index 3 = Y / Triangle
- Index 4 = LB / L1
- Index 5 = RB / R1
- Index 6 = LT / L2 (also axis)
- Index 7 = RT / R2 (also axis)
- Index 8 = Back / Share
- Index 9 = Start / Options
- Index 10 = L3
- Index 11 = R3
- Axes: 0=LX, 1=LY, 2=RX, 3=RY

### Deadzone
Left and right stick deadzone: **0.15** (configured in gamepadInput.ts)

### Active Device Detection
- On startup: check `navigator.getGamepads()` for connected controllers
- On connect: `gamepadconnected` event
- On disconnect: `gamepaddisconnected` event
- Active device tracking: if gamepad sticks moved recently → show gamepad prompts; else → show keyboard prompts

### Controller Prompts
UI shows correct button icons based on active device:
- Xbox icons for Xbox controller
- PlayStation icons for DualShock/DualSense
- Keyboard icons for keyboard fallback
- Detected from `gamepad.id` string (see `gamepadInput.ts`)
