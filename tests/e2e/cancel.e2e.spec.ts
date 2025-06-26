import { test, expect } from '@playwright/test';

test.describe('Annulation de cours', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'user1@mail.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('cas passant : annulation dans les temps', async ({ page }) => {
    await page.click('text=Annuler');
    await expect(page.locator('.alert-success')).toContainText(/annulé/i);
  });

  test('cas non passant : annulation tardive', async ({ page }) => {
    // Simuler une annulation hors délai (via seed ou API)
    await page.goto('http://localhost:5173/dashboard');
    await page.click('text=Annuler', { force: true });
    await expect(page.locator('.alert-error')).toContainText(/pénalité|tardive/i);
  });

  test('cas limite : annulation d’un cours passé', async ({ page }) => {
    // Simuler un cours déjà passé
    await page.goto('http://localhost:5173/dashboard');
    await page.click('text=Annuler', { force: true });
    await expect(page.locator('.alert-error')).toBeVisible();
  });
});
