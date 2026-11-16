import { expect, test } from '@playwright/test';

test('manages an event from the organizer workspace', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.getByRole('button', { name: 'Menu' }).click();
  await page
    .getByRole('navigation', { name: 'Admin navigation' })
    .getByRole('link', { name: 'Events', exact: true })
    .click();
  await expect(page.getByRole('heading', { name: 'Your events' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Delete Night Shift' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Delete Open Studio' }).click();
  await page.getByRole('button', { name: 'Keep event' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();

  await page.getByRole('link', { name: 'Add event', exact: true }).click();
  await page.locator('ion-input[name="name"] input').fill('Film Night');
  await page.locator('ion-input[name="category"] input').fill('Film');
  await page.locator('ion-input[name="venue"] input').fill('Rio Cinema');
  await page.locator('ion-input[name="date"] input').fill('2026-12-12');
  await page.locator('ion-input[name="time"] input').fill('19:00');
  await page.locator('ion-input[name="price"] input').fill('150');
  await page.locator('ion-input[name="capacity"] input').fill('25');
  await page.locator('ion-textarea textarea').fill('Independent films and a short Q&A.');
  await page.locator('input[type="file"]').setInputFiles('src/assets/night-shift-concert.jpg');
  await expect(page.locator('.event-preview img')).toHaveAttribute('src', /^data:image\/jpeg/);
  await page.getByRole('button', { name: 'Publish event' }).click();
  await expect(page.getByRole('heading', { name: 'Film Night', level: 1 })).toBeVisible();

  await page.getByRole('link', { name: 'Edit event' }).click();
  await expect(page.locator('ion-input[name="name"] input')).toHaveValue('Film Night');
  await page.locator('ion-input[name="name"] input').fill('Late Film Night');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('heading', { name: 'Late Film Night', level: 1 })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Late Film Night', level: 1 })).toBeVisible();
  await expect(page.locator('.detail-banner img')).toHaveAttribute('src', /^data:image\/jpeg/);

  await page.getByRole('link', { name: 'Back to events' }).click();
  await page.getByRole('button', { name: 'Delete Late Film Night' }).click();
  await page.getByRole('button', { name: 'Yes, delete event' }).click();
  await expect(page.getByRole('status')).toHaveText('Late Film Night was deleted.');
  await expect(page.getByRole('rowheader', { name: /Late Film Night/ })).toHaveCount(0);
});

test('opens the organizer preview and filters bookings by event', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Admin log in' })).toBeVisible();
  await expect
    .poll(() => page.locator('.auth-poster img').evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);
  await page.locator('ion-input[name="email"] input').fill('organizer@example.com');
  await page.locator('ion-input[name="password"] input').fill('preview-password');
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
  await page.getByRole('link', { name: 'Manage event' }).click();
  await page.getByRole('link', { name: 'View bookings', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Night Shift bookings' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'The Comedy Club' })).toHaveCount(0);
});
