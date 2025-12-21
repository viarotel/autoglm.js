import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/cli.ts',
  ],
  dts: true,
  exports: true,
  publint: true,
  external: [
    'cfonts',
    '@autoglm.js/shared',
    '@autoglm.js/platform-tools-darwin',
    '@autoglm.js/platform-tools-linux',
    '@autoglm.js/platform-tools-windows',
  ],
})
