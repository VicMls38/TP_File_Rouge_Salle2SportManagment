import { test, expect } from '@playwright/test';

test.describe('Réservation de cours', () => {
  test.beforeEach(async ({ page }) => {
    // Connexion utilisateur
    await page.goto('/login');
    await page.fill('input[type="email"]', 'user1@mail.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('cas passant : réservation d’un cours', async ({ page }) => {
    await page.click('text=Réserver');
    await expect(page.locator('.recent-bookings')).toContainText(/Confirmé/);
  });

  test('cas non passant : réservation sur cours complet', async ({ page }) => {
    // Simuler un cours complet (via seed ou API)
    await page.goto('/dashboard');
    await page.click('text=Réserver', { force: true });
    await expect(page.locator('.alert-error')).toContainText(/complet|impossible/i);
  });

  test('cas limite : dernier créneau disponible', async ({ page }) => {
    // Simuler un cours avec 1 place restante
    await page.goto('/dashboard');
    await page.click('text=Réserver', { force: true });
    await expect(page.locator('.recent-bookings')).toContainText(/Confirmé/);
  });
});
