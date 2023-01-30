import * as babel from '@babel/core';
import { TransformerFn } from 'tailwindcss/types/config';

export const transformBabel = (ext: string, content: string) => {
  const config: babel.TransformOptions = {
    filename: `typewind.${ext}`,
    plugins: ['typewind/babel'],
  };
  if (ext === 'ts' || ext === 'tsx') {
    config.presets = ['@babel/preset-typescript'];
  }

  if (ext === 'js' || ext === 'jsx') {
    config.plugins?.push('@babel/plugin-syntax-jsx');
  }

  const res = babel.transformSync(content, config);

  if (res?.code) {
    return res?.code;
  }

  throw new Error('Failed to transform file');
}

export const typewindTransforms: Record<string, TransformerFn> = {
  tsx: (content) => transformBabel('tsx', content),
  ts: (content) => transformBabel('ts', content),
  jsx: (content) => transformBabel('jsx', content),
  js: (content) => transformBabel('js', content),
};
