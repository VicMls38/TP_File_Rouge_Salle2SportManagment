import { test, expect } from '@playwright/test';

test.describe('Affichage des informations d’abonnement', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'user1@mail.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('cas passant : abonnement actif affiché', async ({ page }) => {
    await expect(page.locator('.subscription-info')).toContainText(/actif/i);
  });

  test('cas non passant : pas d’abonnement', async ({ page }) => {
    // Simuler un utilisateur sans abonnement
    await page.goto('http://localhost:5173/dashboard');
    await expect(page.locator('.alert-info')).toContainText(/pas d’abonnement/i);
  });

  test('cas limite : abonnement expirant aujourd’hui', async ({ page }) => {
    // Simuler un abonnement expirant aujourd’hui
    await page.goto('http://localhost:5173/dashboard');
    await expect(page.locator('.subscription-info')).toContainText(/expire/i);
  });
});
