import _eval from 'eval';
import path from 'path';
import resolveConfig from 'tailwindcss/resolveConfig.js';
import { buildSync } from 'esbuild';
import fs from 'fs';
// @ts-ignore
import { createContext } from 'tailwindcss/lib/lib/setupContextUtils.js';

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
    './tailwind.config.ts',
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
    'No tailwind config file found!\nIf your tailwind config file is not on the same folder, check: https://typewind.dev/docs/installation/custom-config-file-path'
  );
}

export function createTypewindContext() {
  const configFile = getConfigPath();
  let pkgJSON;

  try {
    pkgJSON = require(path.join(process.cwd(), 'package.json'));
  } catch {
    pkgJSON = {};
  }

  let config: any;
  if (configFile.endsWith('.ts')) {
    const preprocessedConfig = buildSync({
      entryPoints: [configFile],
      write: false,
      bundle: true,
      format: 'cjs',
      target: 'node14',
      platform: 'node',
      external: ['node_modules/*'],
    }).outputFiles[0].text;

    const evalResult = _eval(preprocessedConfig, true) as any;
    config = evalResult.default ?? evalResult;
  } else {
    config = require(configFile);
  }

  const userConfig = resolveConfig(config);

  return createContext(userConfig);
}
