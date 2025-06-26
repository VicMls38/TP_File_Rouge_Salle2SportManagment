import { test, expect } from '@playwright/test';

test.describe('Fonctionnalités administrateur', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@mail.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/admin/);
  });

  test('cas passant : création de cours', async ({ page }) => {
    await page.click('text=Nouveau Cours');
    await page.fill('input[placeholder="Titre"]', 'Cours E2E');
    await page.fill('input[placeholder="Coach"]', 'Coach E2E');
    await page.fill('input[type="datetime-local"]', '2025-07-01T10:00');
    await page.fill('input[placeholder="Capacité"]', '20');
    await page.click('button[type="submit"]');
    await expect(page.locator('.alert-success')).toContainText(/créé/i);
  });

  test('cas non passant : accès refusé utilisateur non admin', async ({ page, context }) => {
    // Nouvelle session utilisateur simple
    const userPage = await context.newPage();
    await userPage.goto('/login');
    await userPage.fill('input[type="email"]', 'user1@mail.com');
    await userPage.fill('input[type="password"]', 'password');
    await userPage.click('button[type="submit"]');
    await userPage.goto('/admin');
    await expect(userPage.locator('.alert-error')).toContainText(/refusé|forbidden|admin/i);
  });

  test('cas limite : création de cours avec valeurs extrêmes', async ({ page }) => {
    await page.click('text=Nouveau Cours');
    await page.fill('input[placeholder="Titre"]', 'A'.repeat(200));
    await page.fill('input[placeholder="Coach"]', 'Coach E2E');
    await page.fill('input[type="datetime-local"]', '2025-07-01T10:00');
    await page.fill('input[placeholder="Capacité"]', '100');
    await page.click('button[type="submit"]');
    await expect(page.locator('.alert-error, .alert-success')).toBeVisible();
  });
});
