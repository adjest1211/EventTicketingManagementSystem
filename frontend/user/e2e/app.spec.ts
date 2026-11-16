import { expect, test } from '@playwright/test';

test('books and cancels a ticket from the event catalogue', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Discover events' })).toBeVisible();
  const menu = page.locator('ion-menu');
  await expect(menu).toBeHidden();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(menu.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await menu.getByRole('link', { name: 'Discover events' }).click();
  await expect(menu).toBeHidden();
  await expect
    .poll(() => page.locator('.hero-photo img').evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);
  await page.getByText('Explore Night Shift', { exact: true }).click();
  await page.getByText('Book tickets', { exact: true }).click();
  await page.locator('ion-input[name="name"] input').fill('Alex Morgan');
  await page.locator('ion-input[name="email"] input').fill('alex@example.com');
  await page.getByRole('button', { name: 'Confirm booking' }).click();
  await expect(page.getByRole('heading', { name: 'Booking confirmed' })).toBeVisible();

  await page.getByText('View my bookings', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'My bookings', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Night Shift' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel booking', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Keep my tickets' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await page.getByRole('button', { name: 'Cancel booking', exact: true }).click();
  await page.getByRole('button', { name: 'Yes, cancel booking' }).click();
  await expect(page.getByRole('heading', { name: 'No bookings yet' })).toBeVisible();
});
