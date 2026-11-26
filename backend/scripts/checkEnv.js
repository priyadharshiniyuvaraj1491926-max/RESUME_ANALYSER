#!/usr/bin/env node
/**
 * checkEnv.js – Validates that all keys declared in .env.example
 * are present in the current process environment (or .env file).
 *
 * Usage:  node scripts/checkEnv.js
 * Exit 0 = all keys present, Exit 1 = missing keys found.
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const examplePath = resolve(__dirname, '../.env.example');

if (!existsSync(examplePath)) {
  console.error('❌  .env.example not found at', examplePath);
  process.exit(1);
}

// Parse .env.example for key names (ignore comments and blank lines)
const exampleKeys = readFileSync(examplePath, 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => line.split('=')[0].trim())
  .filter(Boolean);

// Also attempt to load .env if present (optional – won't override process.env)
const envPath = resolve(__dirname, '../.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const [key, ...rest] = line.split('=');
    if (key && key.trim() && !key.trim().startsWith('#')) {
      const k = key.trim();
      if (!(k in process.env)) process.env[k] = rest.join('=').trim();
    }
  }
}

let missing = 0;
for (const key of exampleKeys) {
  const present = key in process.env;
  const value = process.env[key];
  const empty = !value || value.trim() === '';
  const isOptional = ['OPENAI_API_KEY', 'GEMINI_API_KEY', 'ADMIN_BOOTSTRAP_TOKEN'].includes(key);

  if (!present) {
    console.error(`❌  MISSING  : ${key}`);
    missing++;
  } else if (empty && !isOptional) {
    console.warn(`⚠️   EMPTY    : ${key}  (should have a value)`);
  } else {
    console.log(`✅  OK       : ${key}`);
  }
}

if (missing > 0) {
  console.error(`\n${missing} required environment variable(s) are missing.`);
  process.exit(1);
} else {
  console.log('\nAll required environment variables are present. ✓');
  process.exit(0);
}
