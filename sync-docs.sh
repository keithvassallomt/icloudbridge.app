#!/bin/bash
# Sync documentation from main iCloudBridge project to website docs-src

echo "Syncing documentation from ../iCloudBridge/docs to docs-src..."

# Copy markdown files
cp -r ../iCloudBridge/docs/*.md docs-src/
cp -r ../iCloudBridge/docs/images docs-src/

# Copy SVG logo and icons to VitePress public/assets directory
echo "Copying logo and icons to docs-src/public/assets..."
mkdir -p docs-src/public/assets/icons
cp ../iCloudBridge/docs/images/iCloudBridge_transparent.svg docs-src/public/assets/
cp ../iCloudBridge/docs/images/icons/*.svg docs-src/public/assets/icons/

echo "Documentation synced successfully!"
echo "Run 'npm run docs:build' to regenerate the documentation site."
