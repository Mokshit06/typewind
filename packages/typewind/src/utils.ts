import path from 'path';
import resolveConfig from 'tailwindcss/resolveConfig.js';
import { createContext } from 'tailwindcss/lib/lib/setupContextUtils.js';
import fs from 'fs';

function getConfigPath() {
  const pkg = require(path.join(process.cwd(), 'package.json'));
  for (const configFile of [
    './tailwind.config.js',
    './tailwind.config.cjs',
    pkg?.typewind?.configPath,
  ]) {
    try {
      const configPath = path.join(process.cwd(), configFile);
      fs.accessSync(configPath);
      return configPath;
    } catch (err) {}
  }

  throw new Error(
    'No tailwind config file found!\nIf your tailwind config file is not on the same folder, check: https://typewind.vercel.app/docs/usage/custom-config-file-path'
  );
}

export function createTypewindContext() {
  const configFile = getConfigPath();
  const userConfig = resolveConfig(require(configFile!));

  return createContext(userConfig);
}
