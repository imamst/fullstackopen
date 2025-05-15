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

        test('User can delete their own blog', async ({ page }) => {
            // Create a blog
            await createBlog(page, 'Delete Test Blog', 'Delete Test Author', 'https://playwright.dev')
            
            // Verify blog is visible
            await expect(page.getByText('Delete Test Blog', { exact: true })).toBeVisible()
            
            // View the blog details
            await page.getByRole('button', { name: 'view', exact: true }).click()
            
            // Set up dialog handler before clicking delete
            page.on('dialog', async dialog => {
                expect(dialog.message()).toBe('Are you sure you want to delete this blog?')
                await dialog.accept()
            })
            
            // Click delete button
            await page.getByRole('button', { name: 'delete', exact: true }).click()
            
            // Verify blog is no longer visible
            await expect(page.getByText('Delete Test Blog', { exact: true })).not.toBeVisible()
        })

        test('Only blog creator can see delete button', async ({ page, request }) => {
            // Create a second user
            await request.post('/api/users', {
                data: {
                    name: 'Second User',
                    username: 'seconduser',
                    password: 'salainen'
                }
            })

            // Create a blog as first user
            await createBlog(page, 'Protected Blog', 'Protected Author', 'https://playwright.dev')
            
            // View the blog details
            await page.getByRole('button', { name: 'view', exact: true }).click()
            
            // Verify delete button is visible for creator
            await expect(page.getByRole('button', { name: 'delete', exact: true })).toBeVisible()
            
            // Logout
            await page.getByRole('button', { name: 'Logout', exact: true }).click()
            
            // Login as second user
            await loginWith(page, 'seconduser', 'salainen')
            
            // View the blog details
            await page.getByRole('button', { name: 'view', exact: true }).click()
            
            // Verify delete button is not visible for non-creator
            await expect(page.getByRole('button', { name: 'delete', exact: true })).not.toBeVisible()
        })

        test('Blogs are sorted by likes in descending order', async ({ page }) => {
            // Create three blogs with different like counts
            await createBlog(page, 'Most Liked Blog', 'Author 1', 'https://playwright.dev')
            await expect(page.getByText('has been added')).toBeVisible()
            await expect(page.getByText('Most Liked Blog', { exact: true })).toBeVisible()

            await createBlog(page, 'Second Most Liked Blog', 'Author 2', 'https://playwright.dev')
            await expect(page.getByText('has been added')).toBeVisible()
            await expect(page.getByText('Second Most Liked Blog', { exact: true })).toBeVisible()

            await createBlog(page, 'Least Liked Blog', 'Author 3', 'https://playwright.dev')
            await expect(page.getByText('has been added')).toBeVisible()
            await expect(page.getByText('Least Liked Blog', { exact: true })).toBeVisible()

            const viewButtons = await page.getByRole('button', { name: 'view', exact: true }).all()

            // View and like the first blog twice
            await viewButtons[0].click()
            await page.getByRole('button', { name: 'like', exact: true }).click()
            await page.getByRole('button', { name: 'like', exact: true }).click()
            await page.getByRole('button', { name: 'hide', exact: true }).click()

            // View and like the second blog once
            await viewButtons[1].click()
            await page.getByRole('button', { name: 'like', exact: true }).click()
            await page.getByRole('button', { name: 'hide', exact: true }).click()

            // Get all blog titles in order
            const blogTitles = await page.getByText(/Blog$/).allTextContents()

            // Verify the order: Most Liked Blog should be first, then Second Most Liked Blog, then Least Liked Blog
            expect(blogTitles[0]).toBe('Most Liked Blog')
            expect(blogTitles[1]).toBe('Second Most Liked Blog')
            expect(blogTitles[2]).toBe('Least Liked Blog')
        })
        
    })
});
