import { test, expect, describe, beforeEach } from '@playwright/test';
import { loginWith } from './helpers';

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'Imam Setiawan',
                username: 'imamst',
                password: 'salainen'
            }
        })

        await page.goto('/')
    });

    test('Login form is shown', async ({ page }) => {
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

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'imamst', 'salainen')

            await expect(page.getByText('Imam Setiawan logged-in')).toBeVisible()
            await expect(page.getByText('Blogs')).toBeVisible()
            await expect(page.getByText('Logout', { exact: true })).toBeVisible()
            await expect(page.getByText('create new blog', { exact: true })).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'imamst', 'wrong')

            await expect(page.getByText('Wrong credentials')).toBeVisible()
        })
    })
});
