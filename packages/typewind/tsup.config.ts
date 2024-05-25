import { defineConfig } from 'tsup';
import { createRequire } from 'module';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/cli.ts',
    'src/babel.ts',
    'src/evaluate.ts',
    'src/transform.ts',
    'src/cn.ts',
  ],
  splitting: false,
  clean: true,
  platform: 'node',
  external: ['typewind', 'tailwindcss'],
  format: ['cjs', 'esm'],
  target: 'esnext',
  dts: true,
});
