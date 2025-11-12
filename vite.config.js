// vite.config.js (CommonJS-friendly, dynamic import for the ESM plugin)
const { defineConfig } = require('vite');

module.exports = async () => {
  // dynamic import to safely load ESM-only plugin from a CommonJS environment
  const reactPlugin = (await import('@vitejs/plugin-react')).default;

  return defineConfig({
    base: './',         // use relative paths for GitHub Pages docs/ deployment
    plugins: [reactPlugin()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  });
};
