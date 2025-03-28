const typewindRspackPlugin = require('typewind/rspack-plugin').default;

module.exports = {
  entry: './src/index.ts',
  plugins: [typewindRspackPlugin()],
};
