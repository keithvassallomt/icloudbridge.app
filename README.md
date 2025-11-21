# icloudbridge.app
Website for iCloudBridge - a utility which syncs Apple Notes, Reminders, Passwords &amp; Photos to other services

## Documentation Setup

This website includes an automatically generated documentation site using VitePress.

### Overview

The documentation is sourced from `/Users/keithv/LocalCode/keithvassallomt/iCloudBridge/docs` and built into `/public/docs` for deployment.

### File Structure

- `docs-src/` - Source markdown files (copied from main project)
- `docs-src/.vitepress/config.js` - VitePress configuration with custom green theme
- `public/docs/` - Built HTML documentation (generated)
- `sync-docs.sh` - Script to sync markdown files from main project

### Commands

#### Development
```bash
# Sync docs from main project and start dev server
npm run docs:sync
npm run docs:dev
```

#### Building
```bash
# Sync and build documentation
npm run docs:sync-build

# Or separately:
npm run docs:sync    # Sync markdown files
npm run docs:build   # Build static HTML
```

#### Preview
```bash
# Preview built docs
npm run docs:preview
```

### Theme

The documentation site is themed to match the main website with:
- Green color scheme (#05C73B primary, #06EA46 for dark mode)
- Dark mode support matching the main site
- Custom navigation and sidebar
- Local search functionality

### Syncing Documentation

Whenever documentation is updated in the main iCloudBridge project, run:

```bash
npm run docs:sync-build
```

This will:
1. Copy all `.md` files from `../iCloudBridge/docs`
2. Copy all images from `../iCloudBridge/docs/images`
3. Rebuild the static documentation site

### Deployment

The built documentation in `public/docs/` should be deployed alongside the main website. It will be accessible at `/docs/` on your domain.