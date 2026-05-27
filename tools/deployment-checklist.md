# DEPLOYMENT CHECKLIST
## The Adventures of Lil Artie

---

## Pre-Build Checklist

### Code
- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] No `console.log` in production paths (use Debug.log which respects DEBUG_MODE)
- [ ] `VITE_DEBUG_MODE=false` in production `.env`
- [ ] All TODO comments reviewed — none blocking MVP

### Assets
- [ ] All GLB files compressed with `gltf-transform optimize`
- [ ] All textures optimized (WebP or compressed PNG)
- [ ] Audio files compressed (MP3 @ 192kbps, OGG @ 160kbps)
- [ ] No placeholder assets in production build (all swapped for real)

### Performance
- [ ] Tested on Chrome (latest)
- [ ] Tested on Firefox (latest)
- [ ] Tested on Edge (latest)
- [ ] Target 60fps on mid-range laptop
- [ ] Draw calls < 300 per frame (use Babylon Inspector or browser profiling to verify)
- [ ] Total bundle size < 5MB (excluding assets)

### Controller
- [ ] Xbox controller tested (Chrome + Edge)
- [ ] PlayStation controller tested
- [ ] Keyboard/mouse tested
- [ ] Controller prompts show correct icons

### Save System
- [ ] Save/load tested: data persists after refresh
- [ ] Save version matches current SAVE_VERSION constant
- [ ] Edge case: corrupt save handled gracefully (default save used)

---

## Build Steps

```bash
# Install dependencies
npm install

# Type check
npm run type-check

# Production build
npm run build

# Preview locally
npm run preview
```

Output: `dist/` folder

---

## Deploy to Vercel (Primary)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Git & Vercel Integration:**
* **GitHub Repository:** `https://github.com/donlito412/the-adventures-of-lil-artie.git`
* **Vercel Connection:** Connected directly to the GitHub repository for automatic deployment on push to the `main` branch.

**Vercel settings:**
- Framework preset: Vite
- Output directory: `dist`
- Build command: `npm run build`
- Install command: `npm install`

---

## Deploy to Netlify (Backup)

**Netlify settings:**
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20

Or drag-drop `dist/` folder to Netlify drop zone.

---

## Post-Deploy Verification

- [ ] Game loads in browser at deployed URL
- [ ] No console errors on first load
- [ ] Controller connects
- [ ] All scenes load without 404 errors
- [ ] Save system works on deployed version
- [ ] Share URL with testers

---

## Versioning

Tag releases: `git tag -a v0.1.0 -m "MVP Release"`  
Keep COMPLETED_TASKS.md and BUGS_AND_FIXES.md updated before each release.
