// Orchestrates E2E: seed then Playwright tests
const { execSync } = require('child_process');

try {
  console.log('🌱 Seeding test database...');
  execSync('node tests/e2e/seed.js', { stdio: 'inherit' });
  console.log('🚀 Running Playwright E2E tests...');
  // Utilise la variable d'environnement si définie
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL ? `--base-url=${process.env.PLAYWRIGHT_BASE_URL}` : '';
  execSync(`npx playwright test tests/e2e ${baseUrl}`, { stdio: 'inherit' });
} catch (e) {
  process.exit(1);
}
// Fin orchestrateur
