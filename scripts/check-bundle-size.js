#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const BUNDLE_LIMIT_KB = parseInt(process.env.BUNDLE_LIMIT_KB || '100', 10);
const distPath = path.join(__dirname, '../packages/client/dist');
const assetsPath = path.join(distPath, 'assets');

// Check dist/ exists
if (!fs.existsSync(distPath)) {
  console.error('❌ dist/ directory not found at', distPath);
  process.exit(1);
}

// Check assets/ exists
if (!fs.existsSync(assetsPath)) {
  console.error('❌ assets/ directory not found at', assetsPath);
  process.exit(1);
}

// Find all .js files in assets
let jsFiles;
try {
  jsFiles = fs.readdirSync(assetsPath).filter(file => file.endsWith('.js'));
} catch (error) {
  console.error('❌ Failed to read assets directory:', error.message);
  process.exit(1);
}

if (jsFiles.length === 0) {
  console.error('❌ No .js bundle files found in', assetsPath);
  process.exit(1);
}

// Calculate total size of all JS bundles
let totalSize = 0;
try {
  jsFiles.forEach(file => {
    const filePath = path.join(assetsPath, file);
    let bundleBuffer;
    try {
      bundleBuffer = fs.readFileSync(filePath);
    } catch (error) {
      console.error(`⚠️  Failed to read ${file}:`, error.message);
      return;
    }

    let gzippedSize;
    try {
      gzippedSize = zlib.gzipSync(bundleBuffer).length / 1024;
    } catch (error) {
      console.error(`❌ Failed to compress ${file}:`, error.message);
      process.exit(1);
    }

    totalSize += gzippedSize;
    console.log(`  ${file}: ${gzippedSize.toFixed(2)} KB (gzipped)`);
  });
} catch (error) {
  console.error('❌ Unexpected error during bundle size calculation:', error.message);
  process.exit(1);
}

console.log(`📦 Total bundle size: ${totalSize.toFixed(2)} KB (gzipped)`);

if (totalSize > BUNDLE_LIMIT_KB) {
  console.error(`❌ Bundle exceeds limit of ${BUNDLE_LIMIT_KB}KB`);
  process.exit(1);
} else {
  console.log(`✅ Bundle size OK (limit: ${BUNDLE_LIMIT_KB}KB)`);
}
