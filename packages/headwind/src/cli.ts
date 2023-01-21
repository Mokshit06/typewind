#!/usr/bin/env node

import { generateTypes } from './type-generator';

generateTypes().catch(err => {
  console.error(err);
  process.exit(1);
});
