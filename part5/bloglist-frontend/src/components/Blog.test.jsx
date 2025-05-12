import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders blog title and author', () => {
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
