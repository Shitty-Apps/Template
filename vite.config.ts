/// <reference types="vitest" />
import { defineConfig } from 'vite'
import path from 'path';
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ["@babel/plugin-proposal-decorators", { legacy: true }],
          ["@babel/plugin-proposal-class-properties", { loose: true }]
        ]
      }
    }),
    legacy(),
    svgr({
      svgrOptions: {
        icon: true,
      },
      include: '**/*.svg',
    }),
  ],
  resolve: {
    alias: {
      '@ionic/react': path.resolve(__dirname, './node_modules/@ionic/react')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@ionic/react/css/core.css";
          @use "@ionic/react/css/normalize.css";
          @use "@ionic/react/css/structure.css";
          @use "@ionic/react/css/typography.css";
          @use "@ionic/react/css/padding.css";
          @use "@ionic/react/css/float-elements.css";
          @use "@ionic/react/css/text-alignment.css";
          @use "@ionic/react/css/text-transformation.css";
          @use "@ionic/react/css/flex-utils.css";
          @use "@ionic/react/css/display.css";
        `
      }
    }
  },
  json: {
    stringify: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
