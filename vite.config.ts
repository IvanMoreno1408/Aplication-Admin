import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { loadEnv } from 'vite';
import type { ProxyOptions } from 'vite';

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

function buildProxy(target: string | undefined, prefix: string): ProxyOptions | undefined {
  if (!target) {
    return undefined;
  }

  return {
    target,
    changeOrigin: true,
    rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
    secure: true,
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const productProxy = buildProxy(env.VITE_PROXY_PRODUCTS_TARGET, '/proxy-productos');
  const usersProxy = buildProxy(env.VITE_PROXY_USERS_TARGET, '/proxy-usuarios');

  return {
    plugins: [react()],
    css: {
      postcss: {
        plugins: [tailwindcss(tailwindConfig), autoprefixer()],
      },
    },
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: ['./src/test/setup.ts'],
    },
    server: {
      proxy: {
        ...(productProxy ? { '/proxy-productos': productProxy } : {}),
        ...(usersProxy ? { '/proxy-usuarios': usersProxy } : {}),
      },
    },
  };
});
