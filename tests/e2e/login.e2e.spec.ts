import { test, expect } from '@playwright/test';

// Cas passant : login valide
// Cas non passant : mauvais mot de passe/email
// Cas limite : email très long, champs vides

test.describe('Connexion utilisateur', () => {
  test('cas passant : login valide', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'user1@mail.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('cas non passant : mauvais mot de passe', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'user1@mail.com');
    await page.fill('input[type="password"]', 'wrong');
    await page.click('button[type="submit"]');
    await expect(page.locator('.alert-error')).toContainText(/erreur|incorrect/i);
  });

  test('cas limite : email très long', async ({ page }) => {
    await page.goto('/login');
    const longEmail = 'a'.repeat(100) + '@mail.com';
    await page.fill('input[type="email"]', longEmail);
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page.locator('.alert-error')).toBeVisible();
  });

  test('cas limite : champs vides', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');
    await expect(page.locator('.alert-error')).toBeVisible();
  });
});
