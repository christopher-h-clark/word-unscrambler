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

// Calculate size of all JS bundles
const bundles = [];
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

    bundles.push({ name: file, size: gzippedSize });
    totalSize += gzippedSize;
  });
} catch (error) {
  console.error('❌ Unexpected error during bundle size calculation:', error.message);
  process.exit(1);
}

// Sort bundles by size (largest first)
bundles.sort((a, b) => b.size - a.size);

console.log(`\n📦 Bundle Size Report (gzipped)\n`);
console.log(`Limit: ${BUNDLE_LIMIT_KB} KB | Total: ${totalSize.toFixed(2)} KB\n`);
console.log('File                          | Size (KB) | % of Total');
console.log('-'.repeat(56));

bundles.forEach(bundle => {
  const percent = ((bundle.size / totalSize) * 100).toFixed(1);
  const status = bundle.size > BUNDLE_LIMIT_KB * 0.8 ? '⚠️ ' : '  ';
  const paddedName = bundle.name.padEnd(28);
  console.log(
    `${status}${paddedName} | ${bundle.size.toFixed(2).padStart(8)} | ${percent.padStart(6)}%`
  );
});

console.log('-'.repeat(56));
console.log(`Total                         | ${totalSize.toFixed(2).padStart(8)} | 100.0%\n`);

if (totalSize > BUNDLE_LIMIT_KB) {
  console.error(
    `❌ Bundle exceeds limit of ${BUNDLE_LIMIT_KB}KB (current: ${totalSize.toFixed(2)}KB)`
  );
  console.error(`\nLargest files to optimize:\n`);
  bundles.slice(0, 3).forEach((bundle, idx) => {
    console.error(`  ${idx + 1}. ${bundle.name}: ${bundle.size.toFixed(2)} KB`);
  });
  process.exit(1);
} else {
  const remaining = BUNDLE_LIMIT_KB - totalSize;
  console.log(`✅ Bundle OK (${remaining.toFixed(2)} KB remaining)`);
}
