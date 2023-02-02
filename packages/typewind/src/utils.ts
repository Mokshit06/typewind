import path from 'path';
import resolveConfig from 'tailwindcss/resolveConfig.js';
import { createContext } from 'tailwindcss/lib/lib/setupContextUtils.js';
import fs from 'fs';

export function loadConfig(): {
  configPath: string;
  showPixelEquivalents: boolean;
  rootFontSize: number;
} {
  const pkg = require(path.join(process.cwd(), 'package.json'));

  return {
    configPath: './tailwind.config.js',
    showPixelEquivalents: false,
    rootFontSize: 16,
    ...pkg?.typewind,
  };
}

function getConfigPath() {
  const config = loadConfig();

  for (const configFile of [
    config.configPath,
    './tailwind.config.js',
    './tailwind.config.cjs',
  ]) {
    try {
      const configPath = path.join(process.cwd(), configFile);
      fs.accessSync(configPath);
      return configPath;
    } catch (err) {}
  }

  throw new Error(
    'No tailwind config file found!\nIf your tailwind config file is not on the same folder, check: https://typewind.vercel.app/docs/installation/custom-config-file-path'
  );
}

export function createTypewindContext() {
  const configFile = getConfigPath();
  const userConfig = resolveConfig(require(configFile!));

  return createContext(userConfig);
}
