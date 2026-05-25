# ANTIGRAVITY NOTES

Notes from Antigravity (project structure, coordination, task flow).

---

## Session: 2026-05-24 — Project Initialization

**Status**: Full project structure scaffolded and complete.

**Structure summary:**
```
the-adventures-of-lil-artie/
├── src/          — 50+ TypeScript files (Codex territory)
├── docs/         — 9 design documents (Claude territory)
├── tasks/        — 6 task tracking files (shared)
├── agent-notes/  — 4 agent note files (per-agent)
├── tools/        — 3 pipeline/deployment docs (Antigravity)
├── public/       — Assets, maps (art pipeline)
└── [config files]
```

**Agent territory map:**
| Directory/File | Owner | Notes |
|---|---|---|
| src/ | Codex | TypeScript only — no Claude edits |
| docs/ | Claude | Design docs — no Codex edits |
| tasks/COMPLETED_TASKS.md | All | All agents update after finishing work |
| tasks/BUGS_AND_FIXES.md | All | Log bugs as found |
| agent-notes/ | Each agent's own file | Cross-read OK, cross-write forbidden |
| agent-notes/DECISIONS.md | Antigravity | Major architecture decisions |
| tools/ | Antigravity | Pipeline, deployment docs |
| public/assets/ | Art team | GLB/GLTF/texture files |

**Coordination rules in effect:**
1. All agents read DECISIONS.md before starting new work
2. No agent overwrites another's files without consensus
3. Source of truth: MASTER_TASK_LIST.md — update checkboxes as phases complete
4. Use BUGS_AND_FIXES.md immediately if a breaking issue is found

**Next structure tasks:**
- Review all stubs once Codex starts implementation
- Add placeholder `.gitkeep` files to empty asset directories
- Set up Git LFS tracking rules for GLB files when first asset lands
- Git Remote: `https://github.com/donlito412/the-adventures-of-lil-artie.git` (connected to Vercel for auto-deployment on `main` push)
