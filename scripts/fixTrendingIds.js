#!/usr/bin/env node
// Utility to renumber the `id` fields in `client/src/data/trendingResources.js`
// so they are sequential after the 22nd element (i.e. start at 23 and increment by 1).
// USAGE: `node scripts/fixTrendingIds.js`
// This script is safe – it only rewrites the file after successfully generating the new content.

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'client', 'src', 'data', 'trendingResources.js');

let src = fs.readFileSync(FILE_PATH, 'utf8');

// Regex to find all id occurrences – captures the numeric value
const idRegex = /(\bid\s*:\s*")([0-9]+)("\s*,?)/g;

let matchCount = 0;
let updated = src.replace(idRegex, (match, p1, p2, p3) => {
  matchCount += 1;
  // Keep the first 22 ids unchanged; renumber the rest sequentially starting from 23
  if (matchCount <= 22) return match; // leave as-is
  const newId = String(matchCount); // because matchCount starts at 1
  return `${p1}${newId}${p3}`;
});

fs.writeFileSync(FILE_PATH, updated, 'utf8');
console.log(`Renumbered ${matchCount - 22} id fields (23 — ${matchCount}). Done.`);
