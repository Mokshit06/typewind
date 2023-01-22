import path from 'path';
import resolveConfig from 'tailwindcss/resolveConfig.js';
import { createContext } from 'tailwindcss/lib/lib/setupContextUtils.js';
import fs from 'fs';

function getConfigPath() {
  for (const configFile of ['./tailwind.config.js', './tailwind.config.cjs']) {
    try {
      const configPath = path.join(process.cwd(), configFile);
      fs.accessSync(configPath);
      return configPath;
    } catch (err) {}
  }

  throw new Error('No tailwind config file found');
}

export function createTypewindContext() {
  const configFile = getConfigPath();
  const userConfig = resolveConfig(require(configFile!));

  return createContext(userConfig);
}
