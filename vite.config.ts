import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Tailwind + PostCSS config consolidado aquí
const tailwindConfig = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-green': '#2d7a2d',
        'brand-green-light': '#3a9e3a',
        'brand-green-dark': '#1e5c1e',
        'brand-yellow': '#f5c518',
        'brand-yellow-dark': '#c9a010',
      },
    },
  },
  plugins: [],
};

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(tailwindConfig),
        autoprefixer(),
      ],
    },
  },
  server: {
    proxy: {
      '/proxy-productos': {
        target: 'https://apiproducto-fnccb2e9g8a8dzak.brazilsouth-01.azurewebsites.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-productos/, ''),
        secure: true,
      },
      '/proxy-usuarios': {
        target: 'https://apiusers-d8drfrcbawbmekgm.brazilsouth-01.azurewebsites.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-usuarios/, ''),
        secure: true,
      },
      '/proxy-imgbb': {
        target: 'https://i.ibb.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-imgbb/, ''),
        secure: true,
      },
    },
  },
});
