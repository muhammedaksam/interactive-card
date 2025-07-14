import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: [
      // Only test core components and utilities
      'src/components/__tests__/**/*.{test,spec}.{js,ts,tsx}',
      'src/utils/__tests__/**/*.{test,spec}.{js,ts,tsx}',
    ],
    exclude: [
      // Exclude non-essential files from testing
      '**/node_modules/**',
      '**/dist/**',
      '**/*.stories.*',
      '**/examples.*',
      '**/demo.*',
      '**/main.*',
      '**/index.*',
      '**/.storybook/**',
      '**/storybook-static/**',
    ],
    coverage: {
      include: [
        // Only include core files in coverage
        'src/components/**/*.{ts,tsx}',
        'src/utils/**/*.{ts,tsx}',
      ],
      exclude: [
        // Exclude non-essential files from coverage
        '**/*.stories.*',
        '**/*.test.*',
        '**/*.spec.*',
        '**/examples.*',
        '**/demo.*',
        '**/main.*',
        '**/index.*',
        '**/__tests__/**',
        '**/node_modules/**',
        '**/dist/**',
      ],
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
