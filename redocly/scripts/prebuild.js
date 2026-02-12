#!/usr/bin/env node

/**
 * Prebuild script - Ensures dist directories exist
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirs = [
  path.join(__dirname, '../dist'),
  path.join(__dirname, '../dist/redoc'),
  path.join(__dirname, '../public'),
];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}
