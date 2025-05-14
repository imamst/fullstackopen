import { test, expect, describe, beforeEach } from '@playwright/test';
import { createBlog, loginWith } from './helpers';

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

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'imamst', 'salainen')
        })
        
        test('A new blog can be created', async ({ page }) => {
            await createBlog(page, 'Playwright Title', 'Playwright Author', 'https://playwright.dev')

            await expect(page.getByText('Playwright Title', { exact: true })).toBeVisible()
            await expect(page.getByText('Playwright Author', { exact: true })).toBeVisible()
            await expect(page.getByRole('button', { name: 'view', exact: true })).toBeVisible()
        })

        test('A blog can be liked', async ({ page }) => {
            // First create a blog
            await createBlog(page, 'Like Test Blog', 'Like Test Author', 'https://playwright.dev')

            // View the blog details
            await page.getByRole('button', { name: 'view', exact: true }).click()

            // Like the blog
            await page.getByRole('button', { name: 'like', exact: true }).click()

            // Verify the like count is updated
            await expect(page.getByText('likes 1', { exact: true })).toBeVisible()
        })
    })
});
