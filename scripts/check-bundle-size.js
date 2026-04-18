#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const BUNDLE_LIMIT_KB = 100;
const bundlePath = path.join(__dirname, '../packages/client/dist/index.js');

if (!fs.existsSync(bundlePath)) {
  console.error('❌ Bundle file not found at', bundlePath);
  process.exit(1);
}

const bundleBuffer = fs.readFileSync(bundlePath);
const gzippedSize = zlib.gzipSync(bundleBuffer).length / 1024;

console.log(`📦 Bundle size: ${gzippedSize.toFixed(2)} KB (gzipped)`);

if (gzippedSize > BUNDLE_LIMIT_KB) {
  console.error(`❌ Bundle exceeds limit of ${BUNDLE_LIMIT_KB}KB`);
  process.exit(1);
} else {
  console.log(`✅ Bundle size OK (limit: ${BUNDLE_LIMIT_KB}KB)`);
}
