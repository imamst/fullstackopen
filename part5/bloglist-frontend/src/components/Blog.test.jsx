import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest'
import blogService from '../services/blogs'

vi.mock('../services/blogs')

describe('Blog component', () => {
  let blog

  beforeEach(() => {
    blog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://test.com',
      likes: 10,
    }
    vi.clearAllMocks()
  })

  test('renders blog title and author on initial', () => {
    const { container } = render(<Blog blog={blog} />)

    const div = container.querySelector('.blog-container')
    expect(div).toHaveTextContent('Test Blog')
    expect(div).toHaveTextContent('Test Author')
    expect(div).not.toHaveTextContent('https://test.com')
    expect(div).not.toHaveTextContent('likes 10')
  })

  test('renders blog url and likes when clicked button view', async () => {
    const user = userEvent.setup()
    render(<Blog blog={blog} setIsUpdated={() => {}} />)

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const div = screen.getByText('likes 10').closest('.blog-container')
    expect(div).toHaveTextContent('https://test.com')
    expect(div).toHaveTextContent('likes 10')
  })

  test('hide blog url and likes and clicked button view twice', async () => {
    const user = userEvent.setup()
    const mockSetIsUpdated = vi.fn()
    const { container } = render(<Blog blog={blog} setIsUpdated={mockSetIsUpdated} />)

    const div = container.querySelector('.blog-container')
    expect(div).toHaveTextContent('Test Blog')
    expect(div).toHaveTextContent('Test Author')

    // First show the details
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const divDetail = container.querySelector('.blog-detail')
    expect(divDetail).toHaveTextContent('https://test.com')
    expect(divDetail).toHaveTextContent('likes 10')

    // Hide the details
    const hideButton = screen.getByText('hide')
    await user.click(hideButton)

    expect(div).not.toHaveTextContent('https://test.com')
    expect(div).not.toHaveTextContent('likes 10')
  })

  test('like button click calls event handler twice', async () => {
    const user = userEvent.setup()
    const mockSetIsUpdated = vi.fn()
    blogService.update.mockResolvedValue({ ...blog, likes: blog.likes + 1 })

    render(<Blog blog={blog} setIsUpdated={mockSetIsUpdated} />)

    // First show the details
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    // Click like button twice
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockSetIsUpdated).toHaveBeenCalledTimes(2)
    expect(blogService.update).toHaveBeenCalledTimes(2)
  })
})