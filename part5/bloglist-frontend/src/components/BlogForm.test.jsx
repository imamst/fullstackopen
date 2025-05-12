import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BlogForm } from './BlogForm'
import blogService from '../services/blogs'

// Mock the blogService
vi.mock('../services/blogs', () => ({
  default: {
    create: vi.fn()
  }
}))

describe('BlogForm', () => {
  it('calls the event handler with the right details when a new blog is created', async () => {
    const setIsCreated = vi.fn()
    const setSuccessMessage = vi.fn()
    const user = userEvent.setup()

    // Mock the create function to return a successful response
    blogService.create.mockResolvedValue({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com'
    })

    render(
      <BlogForm
        setIsCreated={setIsCreated}
        setSuccessMessage={setSuccessMessage}
      />
    )

    // Find the create new blog button and click it
    const createButton = screen.getByText('create new blog')
    await user.click(createButton)

    // Fill in the form
    const titleInput = screen.getByLabelText('Title:')
    const authorInput = screen.getByLabelText('Author:')
    const urlInput = screen.getByLabelText('URL:')

    await user.type(titleInput, 'Test Blog')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://test.com')

    // Submit the form
    const submitButton = screen.getByText('Create')
    await user.click(submitButton)

    // Verify that blogService.create was called with the correct data
    expect(blogService.create).toHaveBeenCalledWith({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com'
    })

    // Check that the success message was set with the correct content
    expect(setSuccessMessage).toHaveBeenCalledWith('a new blog Test Blog by Test Author added')
    expect(setIsCreated).toHaveBeenCalledWith(true)
  })
})