import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: ['packages/arcgis-rest-basemap-sessions/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    coverage: {
      enabled: true,
      include: ['packages/arcgis-rest-basemap-sessions/src/**/*.{ts,js}'],
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage/vitest',
      thresholds: {
        100: true,
      }
    },
  },
})