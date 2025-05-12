import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog title and author on initial', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://test.com',
    likes: 10,
  }

  const { container } = render(<Blog blog={blog} />)

  screen.debug(container)

  const div = container.querySelector('.blog-container')
  expect(div).toHaveTextContent('Test Blog')
  expect(div).toHaveTextContent('Test Author')
  expect(div).not.toHaveTextContent('https://test.com')
  expect(div).not.toHaveTextContent('likes 10')
})

test('renders blog url and likes when clicked button view', async () => {
  const user = userEvent.setup()
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://test.com',
    likes: 10,
  }

  const { container } = render(<Blog blog={blog} setIsUpdated={() => {}} />)

  const viewButton = screen.getByText('view')

  screen.debug(viewButton)

  await user.click(viewButton)

  const div = container.querySelector('.blog-container')
  expect(div).toHaveTextContent('https://test.com')
  expect(div).toHaveTextContent('likes 10')
})