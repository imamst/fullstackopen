import { test, expect, describe, beforeEach } from '@playwright/test';

describe('Blog app', () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('login page has expected elements', async ({ page }) => {
    const blogTextLocator = page.getByText('Blogs');
    await expect(blogTextLocator).toBeVisible();

    const loginTextLocator = page.getByText('Log in to application');
    await expect(loginTextLocator).toBeVisible();

    const usernameInputLocator = page.getByLabel('username');
    await expect(usernameInputLocator).toBeVisible();

    const passwordInputLocator = page.getByLabel('password');
    await expect(passwordInputLocator).toBeVisible();

    const loginButtonLocator = page.getByRole('button', { name: 'Login' });
    await expect(loginButtonLocator).toBeVisible();
    });
});
