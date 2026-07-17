import { defineConfig } from 'vitest/config';

// With a custom domain (cupofiq.com), Vite base stays '/' (design.md §1).
export default defineConfig({
  base: '/',
  build: { target: 'es2019' },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // TZ pinned so DST-boundary dayNumber tests are deterministic — CI runs UTC
    // otherwise (design.md §1, swarm.md ARCH-3).
    env: { TZ: 'America/New_York' },
  },
});
