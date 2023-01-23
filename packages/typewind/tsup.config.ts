import { defineConfig } from 'tsup';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/cli.ts',
    'src/babel.ts',
    'src/evaluate.ts',
    'src/transform.ts',
  ],
  splitting: false,
  clean: true,
  platform: 'node',
  external: ['typewind', 'tailwindcss'],
  format: ['cjs'],
  target: 'esnext',
  dts: true,
});
