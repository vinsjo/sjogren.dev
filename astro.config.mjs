// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

/**
 * @typedef {import('astro').ViteUserConfig} ViteUserConfig
 * @typedef {NonNullable<ViteUserConfig['environments']>[string]} EnvironmentOptions
 */

/**
 * R3F has no `exports` map, so Node loads its CJS build (which `require`s three)
 * when rendering on the server. Bundling it makes Vite use the ESM build instead.
 * Dev renders in the `ssr` environment, builds prerender in `prerender`.
 *
 * @type {EnvironmentOptions}
 */
const serverEnvironment = {
  resolve: { noExternal: ['@react-three/fiber'] },
};

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    build: {
      rolldownOptions: {
        output: { assetFileNames: 'assets/[hash][extname]' },
      },
    },
    environments: {
      ssr: serverEnvironment,
      prerender: serverEnvironment,
      // Astro sets its own client file names, so overrides must target the client environment
      client: {
        build: {
          rolldownOptions: {
            output: {
              chunkFileNames: 'js/[hash].js',
              entryFileNames: 'js/[hash].js',
              assetFileNames: 'assets/[hash][extname]',
            },
          },
        },
      },
    },
  },
});
