import { defineConfig, devices } from '@playwright/test';

// Utilisation dynamique de la baseURL pour les tests E2E :
// - En Docker/Nginx (prod, CI, conteneur) : http://localhost:8080 (par défaut)
// - En local/dev (Vite) : PLAYWRIGHT_BASE_URL=http://localhost:5173 npx playwright test
//   ou $env:PLAYWRIGHT_BASE_URL="http://localhost:5173"; npm run test:e2e
//
// Les URLs dans les tests doivent être RELATIVES (ex: await page.goto('/login'))
// pour que la baseURL soit appliquée automatiquement.
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8080';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.e2e.spec.ts', // N'exécute que les tests E2E
  timeout: 30 * 1000,
  retries: 0,
  workers: 1, // Pour faciliter la lecture des logs
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
