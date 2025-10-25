# Release Automation Guide

This guide explains how to use the automated release process that handles version bumping, git tagging, and pushing.

## Quick Start

```bash
# Patch release (1.0.7 -> 1.0.8) and push
npm run release:push

# Minor release (1.0.7 -> 1.1.0) and push
npm run release:minor:push

# Major release (1.0.7 -> 2.0.0) and push
npm run release:major:push
```

## Available Commands

### Release Commands (with auto push)

| Command | Version Change | Example | Auto Push |
|---------|---------------|---------|-----------|
| `npm run release:push` | Patch (x.x.**X**) | 1.0.7 → 1.0.8 | ✅ Yes |
| `npm run release:minor:push` | Minor (x.**X**.0) | 1.0.7 → 1.1.0 | ✅ Yes |
| `npm run release:major:push` | Major (**X**.0.0) | 1.0.7 → 2.0.0 | ✅ Yes |

### Release Commands (manual push)

| Command | Version Change | Example | Auto Push |
|---------|---------------|---------|-----------|
| `npm run release` | Patch (x.x.**X**) | 1.0.7 → 1.0.8 | ❌ No |
| `npm run release:patch` | Patch (x.x.**X**) | 1.0.7 → 1.0.8 | ❌ No |
| `npm run release:minor` | Minor (x.**X**.0) | 1.0.7 → 1.1.0 | ❌ No |
| `npm run release:major` | Major (**X**.0.0) | 1.0.7 → 2.0.0 | ❌ No |

## What the Release Script Does

When you run a release command, the script will:

1. ✅ **Validate** - Check for uncommitted changes
2. ✅ **Increment Version** - Update version in:
   - `package.json`
   - `src/manifest.json`
3. ✅ **Commit** - Create a commit with message: `chore: bump version to X.X.X`
4. ✅ **Tag** - Create a git tag: `vX.X.X`
5. ✅ **Push** (if `--push` flag) - Push commit and tag to remote

## Semantic Versioning Guide

Choose the right version bump based on your changes:

### Patch Release (1.0.7 → 1.0.8)
Use for bug fixes and minor changes:
- 🐛 Bug fixes
- 📝 Documentation updates
- 🎨 UI tweaks
- ⚡ Performance improvements (no API changes)

```bash
npm run release:push
```

### Minor Release (1.0.7 → 1.1.0)
Use for new features (backward compatible):
- ✨ New features
- 🚀 New functionality
- 📦 New components
- 🔧 Configuration changes

```bash
npm run release:minor:push
```

### Major Release (1.0.7 → 2.0.0)
Use for breaking changes:
- 💥 Breaking API changes
- 🔄 Major refactoring
- 🗑️ Removed features
- ⚠️ Incompatible changes

```bash
npm run release:major:push
```

## Workflow Examples

### Example 1: Quick Patch Release

```bash
# Make your changes and commit them
git add .
git commit -m "fix: resolve button click issue"

# Bump version and push (1.0.7 -> 1.0.8)
npm run release:push
```

### Example 2: Minor Release with Review

```bash
# Make your changes
git add .
git commit -m "feat: add dark mode support"

# Bump version without pushing (review first)
npm run release:minor

# Review the changes
git log -1
git show v1.1.0

# Push manually when ready
git push origin main
git push origin v1.1.0
```

### Example 3: Major Release

```bash
# Make breaking changes
git add .
git commit -m "feat!: redesign API structure"

# Bump major version and push
npm run release:major:push
```

## Complete Build & Release Workflow

Here's a typical workflow from development to production:

```bash
# 1. Make your changes
# ... code, code, code ...

# 2. Build and test
npm run build

# 3. Commit your changes
git add .
git commit -m "feat: add new feature"

# 4. Release (increments version, creates tag, pushes)
npm run release:push

# 5. (Optional) Upload to Chrome Web Store
npm run upload
```

## Troubleshooting

### Error: "You have uncommitted changes"

**Solution:** Commit or stash your changes first:
```bash
git add .
git commit -m "your message"
```

### Error: "Tag vX.X.X already exists"

**Solution:** The version was already released. If you need to release again, either:
- Delete the tag: `git tag -d vX.X.X && git push origin :refs/tags/vX.X.X`
- Or make another release with a higher version

### Need to Undo a Release

If you haven't pushed yet:
```bash
# Undo the commit and tag
git reset --hard HEAD~1
git tag -d vX.X.X
```

If you already pushed:
```bash
# Delete remote tag
git push origin :refs/tags/vX.X.X

# Delete local tag
git tag -d vX.X.X

# Revert the commit
git revert HEAD
git push origin main
```

## CI/CD Integration

The release script is designed to work with GitHub Actions. When you push a tag:

1. Tag pushed → `v1.0.8`
2. GitHub Actions triggered
3. Extension built automatically
4. (Optional) Uploaded to Chrome Web Store

## Advanced Usage

### Custom Release Command

```bash
# Direct command with version type
node tools/release.mjs patch --push
node tools/release.mjs minor
node tools/release.mjs major --push
```

### Check Current Version

```bash
# View current version
node -p "require('./package.json').version"

# Or
npm version
```

### List All Tags

```bash
# List all release tags
git tag -l

# Show latest tag
git describe --tags --abbrev=0
```

## Best Practices

1. ✅ **Always commit your changes first** before running release
2. ✅ **Test your build** before releasing: `npm run build`
3. ✅ **Follow semantic versioning** guidelines
4. ✅ **Write clear commit messages** using conventional commits
5. ✅ **Use `--push` flag** when you're confident about the release
6. ✅ **Review tags** before pushing: `git show v1.0.8`

## Related Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Formatting
npm run format           # Format code
npm run format:check     # Check formatting

# Legacy tag commands (prefer using release commands)
npm run tag              # Create tag from current package.json
npm run tag:push         # Create and push tag

# Upload to Chrome Web Store
npm run upload           # Upload built extension
```

## Summary

**Most Common Command:**
```bash
npm run release:push
```

This single command will:
- Bump patch version (1.0.7 → 1.0.8)
- Update package.json and manifest.json
- Commit the changes
- Create a git tag
- Push everything to remote
- Trigger GitHub Actions (if configured)

🎉 **That's it!** Your extension is ready for deployment.

