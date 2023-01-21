#!/usr/bin/env node

import path from 'path';
import { generateTypes } from './type-generator';

(globalThis as any).tailwindPath = path.join(
  require.resolve('tailwindcss'),
  '..'
);

generateTypes().catch(err => {
  console.error(err);
  process.exit(1);
});
