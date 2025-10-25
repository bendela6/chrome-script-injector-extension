# 🚀 Quick Release Commands

## One-Command Release (Most Common)

```bash
npm run release:push
```
**Does:** 1.0.7 → 1.0.8, commits, tags, pushes ✅

---

## All Commands

### 🐛 Patch Release (Bug Fixes)
```bash
npm run release:push          # 1.0.7 → 1.0.8 + auto push
npm run release:patch         # 1.0.7 → 1.0.8 (no push)
```

### ✨ Minor Release (New Features)
```bash
npm run release:minor:push    # 1.0.7 → 1.1.0 + auto push
npm run release:minor         # 1.0.7 → 1.1.0 (no push)
```

### 💥 Major Release (Breaking Changes)
```bash
npm run release:major:push    # 1.0.7 → 2.0.0 + auto push
npm run release:major         # 1.0.7 → 2.0.0 (no push)
```

---

## Typical Workflow

```bash
# 1. Make changes & commit
git add .
git commit -m "fix: bug in login"

# 2. Release (one command!)
npm run release:push

# Done! ✨
```

---

## What the Script Does

1. ✅ Increments version in `package.json` and `src/manifest.json`
2. ✅ Creates git commit: `chore: bump version to X.X.X`
3. ✅ Creates git tag: `vX.X.X`
4. ✅ Pushes to remote (if `:push` variant)

---

## When To Use Which

| Situation | Command | Version Change |
|-----------|---------|----------------|
| Bug fix | `npm run release:push` | 1.0.7 → 1.0.8 |
| New feature | `npm run release:minor:push` | 1.0.7 → 1.1.0 |
| Breaking change | `npm run release:major:push` | 1.0.7 → 2.0.0 |

---

## Full Workflow Example

```bash
# Development
npm run dev

# Build
npm run build

# Commit changes
git add .
git commit -m "feat: add new feature"

# Release (auto version bump + tag + push)
npm run release:push

# Upload to Chrome Store
npm run upload
```

---

**📖 More info:** See `RELEASE_GUIDE.md` for complete documentation

