import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.tsx',
  ],
  dts: false,
  exports: false,
  publint: true,
  external: [
    'cfonts',
    '@autoglm.js/shared',
  ],
})
