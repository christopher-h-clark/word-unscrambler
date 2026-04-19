#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const COVERAGE_THRESHOLD = 70;
const packages = ['client', 'server'];
let allMetricsPass = true;

console.log(`📊 Checking coverage threshold (${COVERAGE_THRESHOLD}%)...\n`);

packages.forEach(pkg => {
  const coveragePath = path.join(__dirname, `../packages/${pkg}/coverage/coverage-final.json`);

  if (!fs.existsSync(coveragePath)) {
    console.error(`❌ ${pkg}: coverage-final.json not found at ${coveragePath}`);
    allMetricsPass = false;
    return;
  }

  let coverageData;
  try {
    coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf-8'));
  } catch (error) {
    console.error(`❌ ${pkg}: failed to parse coverage-final.json: ${error.message}`);
    allMetricsPass = false;
    return;
  }

  // Calculate totals from all files
  let totalStatements = 0, coveredStatements = 0;
  let totalFunctions = 0, coveredFunctions = 0;
  let totalBranches = 0, coveredBranches = 0;

  Object.values(coverageData).forEach(fileCoverage => {
    if (typeof fileCoverage !== 'object' || !fileCoverage.s) return; // Skip non-coverage objects

    // Statements
    Object.values(fileCoverage.s || {}).forEach(count => {
      totalStatements++;
      if (count > 0) coveredStatements++;
    });

    // Functions
    Object.values(fileCoverage.f || {}).forEach(count => {
      totalFunctions++;
      if (count > 0) coveredFunctions++;
    });

    // Branches
    Object.values(fileCoverage.b || {}).forEach(branchValue => {
      if (Array.isArray(branchValue)) {
        branchValue.forEach(count => {
          totalBranches++;
          if (count > 0) coveredBranches++;
        });
      } else if (typeof branchValue === 'object' && branchValue.locations) {
        branchValue.locations.forEach((_, idx) => {
          const count = Array.isArray(branchValue) ? branchValue[idx] : 0;
          totalBranches++;
          if (count > 0) coveredBranches++;
        });
      }
    });
  });

  const metrics = {
    statements: totalStatements > 0 ? (coveredStatements / totalStatements) * 100 : 0,
    functions: totalFunctions > 0 ? (coveredFunctions / totalFunctions) * 100 : 0,
    branches: totalBranches > 0 ? (coveredBranches / totalBranches) * 100 : 0,
  };

  console.log(`📦 ${pkg}:`);
  let pkgPass = true;
  Object.entries(metrics).forEach(([metric, pct]) => {
    const status = pct >= COVERAGE_THRESHOLD ? '✅' : '❌';
    console.log(`   ${status} ${metric}: ${pct.toFixed(2)}%`);
    if (pct < COVERAGE_THRESHOLD) pkgPass = false;
  });

  if (!pkgPass) allMetricsPass = false;
  console.log();
});

if (allMetricsPass) {
  console.log(`✅ All packages meet ${COVERAGE_THRESHOLD}% coverage threshold`);
  process.exit(0);
} else {
  console.error(`❌ Coverage below ${COVERAGE_THRESHOLD}% threshold`);
  process.exit(1);
}
