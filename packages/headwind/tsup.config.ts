import { defineConfig } from 'tsup';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts', 'src/babel.ts'],
  splitting: false,
  clean: true,
  platform: 'node',
  external: ['headwind'],
  format: ['cjs', 'esm'],
  target: 'esnext',
  define: {
    // fuck this is very very hacky lmfao
    // please fix this before publishing
    __dirname: 'globalThis.tailwindPath',
  },
  dts: true,
});
