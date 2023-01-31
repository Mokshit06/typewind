// @ts-ignore
import { transformBabel } from 'typewind/transform';
import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs';

describe('transformBabel', () => {
  const cwd = process.cwd();
  const fixturesDir = path.join(cwd, 'tests', 'fixtures');
  process.chdir(fixturesDir);
  const dirs = glob.sync('*', { cwd: fixturesDir });
  test.each(dirs)('works with %s', dir => {
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
  });
});
