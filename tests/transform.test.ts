// @ts-ignore
import { transformBabel } from 'typewind/transform';
import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs';

function setupTest(fixturesDir: string, dir: string) {
  const dirPath = path.join(fixturesDir, dir);
  process.chdir(dirPath);

  const files = glob.sync('*.{ts,tsx,js,jsx}', { cwd: dirPath });

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const ext = path.extname(file).slice(1);
    const content = fs.readFileSync(filePath, 'utf-8');
    const res = transformBabel(ext, content);
    expect(res).toBeDefined();
    expect(res).toMatchSnapshot();
  });
}

describe('transformBabel', () => {
  const cwd = process.cwd();
  const fixturesDir = path.join(cwd, 'tests', 'fixtures');

  test('works with container-queries', () => {
    setupTest(fixturesDir, 'container-queries');
  });

  test('works with arbitrary-values', () => {
    setupTest(fixturesDir, 'arbitrary-values');
  });

  test('works with arbitrary-variants', () => {
    setupTest(fixturesDir, 'arbitrary-variants');
  });

  test('works with modifiers', () => {
    setupTest(fixturesDir, 'modifiers');
  });

  test('works with normal-usage', () => {
    setupTest(fixturesDir, 'normal-usage');
  });

  test('works with transform', () => {
    setupTest(fixturesDir, 'transform');
  });

  test('content without tw usage passes through unchanged', () => {
    setupTest(fixturesDir, 'normal-usage');
    const input = `const x = 1 + 2;`;
    const result = transformBabel('js', input);
    expect(result).toBeDefined();
    expect(result).toContain('const x = 1 + 2');
  });

  test('multiple tw expressions in one file', () => {
    setupTest(fixturesDir, 'normal-usage');
    const input = `import { tw } from 'typewind';
const a = tw.border;
const b = tw.flex;`;
    const result = transformBabel('ts', input);
    expect(result).toBeDefined();
    expect(result).toContain('"border"');
    expect(result).toContain('"flex"');
  });

  test('js extension adds jsx syntax plugin', () => {
    setupTest(fixturesDir, 'normal-usage');
    const input = `import { tw } from 'typewind';
const styles = tw.border;`;
    const result = transformBabel('js', input);
    expect(result).toBeDefined();
    expect(result).toContain('"border"');
  });

  test('jsx extension handles JSX syntax', () => {
    setupTest(fixturesDir, 'normal-usage');
    const input = `import { tw } from 'typewind';
const el = <div className={tw.flex}>hello</div>;`;
    const result = transformBabel('jsx', input);
    expect(result).toBeDefined();
    expect(result).toContain('"flex"');
  });
});
