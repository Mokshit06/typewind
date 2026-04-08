// @ts-ignore
import { typewindTransforms } from '../packages/typewind/src/transform';

describe('typewindTransforms', () => {
  test('exports transform functions for tsx, ts, jsx, js', () => {
    expect(typewindTransforms).toHaveProperty('tsx');
    expect(typewindTransforms).toHaveProperty('ts');
    expect(typewindTransforms).toHaveProperty('jsx');
    expect(typewindTransforms).toHaveProperty('js');
    expect(typeof typewindTransforms.tsx).toBe('function');
    expect(typeof typewindTransforms.ts).toBe('function');
    expect(typeof typewindTransforms.jsx).toBe('function');
    expect(typeof typewindTransforms.js).toBe('function');
  });

  test('has exactly four extension keys', () => {
    const keys = Object.keys(typewindTransforms);
    expect(keys).toHaveLength(4);
    expect(keys.sort()).toEqual(['js', 'jsx', 'ts', 'tsx']);
  });
});
