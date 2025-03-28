/**
 * Rspack plugin for Typewind
 * This plugin adds the Typewind loader to process JavaScript and TypeScript files
 */
export default function typewindRspackPlugin() {
  return {
    name: 'typewind-rspack-plugin',
    setup(compiler: any) {
      const rules = compiler.options.module?.rules || [];
      
      rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'typewind/rspack',
          },
        ],
      });
    },
  };
}
