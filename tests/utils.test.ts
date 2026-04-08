import * as path from 'path';
import { loadConfig, createTypewindContext } from '../packages/typewind/src/utils';

// Use __dirname for stable path resolution regardless of cwd changes from other tests
const REPO_ROOT = path.resolve(__dirname, '..');
const FIXTURES_DIR = path.join(REPO_ROOT, 'tests', 'fixtures', 'normal-usage');

describe('utils', () => {
  afterEach(() => {
    process.chdir(REPO_ROOT);
  });

  describe('loadConfig', () => {
    test('returns default config when no typewind config in package.json', () => {
      process.chdir(FIXTURES_DIR);
      const config = loadConfig();
      expect(config).toEqual({
        configPath: './tailwind.config.js',
        showPixelEquivalents: false,
        rootFontSize: 16,
      });
    });

    test('config has expected shape', () => {
      process.chdir(FIXTURES_DIR);
      const config = loadConfig();
      expect(config).toHaveProperty('configPath');
      expect(config).toHaveProperty('showPixelEquivalents');
      expect(config).toHaveProperty('rootFontSize');
      expect(typeof config.configPath).toBe('string');
      expect(typeof config.showPixelEquivalents).toBe('boolean');
      expect(typeof config.rootFontSize).toBe('number');
    });
  });

  describe('createTypewindContext', () => {
    test('creates context with candidateRuleMap and variantMap', () => {
      process.chdir(FIXTURES_DIR);
      const ctx = createTypewindContext();
      expect(ctx).toBeDefined();
      expect(ctx.candidateRuleMap).toBeDefined();
      expect(ctx.variantMap).toBeDefined();
    });

    test('candidateRuleMap is a Map', () => {
      process.chdir(FIXTURES_DIR);
      const ctx = createTypewindContext();
      expect(ctx.candidateRuleMap).toBeInstanceOf(Map);
    });

    test('variantMap is a Map', () => {
      process.chdir(FIXTURES_DIR);
      const ctx = createTypewindContext();
      expect(ctx.variantMap).toBeInstanceOf(Map);
    });

    test('candidateRuleMap contains standard tailwind utilities', () => {
      process.chdir(FIXTURES_DIR);
      const ctx = createTypewindContext();
      expect(ctx.candidateRuleMap.has('flex')).toBe(true);
      expect(ctx.candidateRuleMap.has('border')).toBe(true);
      expect(ctx.candidateRuleMap.has('hidden')).toBe(true);
    });

    test('variantMap contains standard tailwind variants', () => {
      process.chdir(FIXTURES_DIR);
      const ctx = createTypewindContext();
      expect(ctx.variantMap.has('hover')).toBe(true);
      expect(ctx.variantMap.has('dark')).toBe(true);
      expect(ctx.variantMap.has('sm')).toBe(true);
      expect(ctx.variantMap.has('md')).toBe(true);
      expect(ctx.variantMap.has('lg')).toBe(true);
    });

    test('throws when no tailwind config found', () => {
      // Repo root has package.json but no tailwind config files
      process.chdir(REPO_ROOT);
      expect(() => createTypewindContext()).toThrow(
        'No tailwind config file found'
      );
    });
  });
});
