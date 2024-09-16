const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({})

  response.json(blogs);
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      title,
      author,
      url,
      likes
    },
    { new: true, runValidators: true, context: 'query' }
  )
  
  if (updatedBlog) {
    response.status(200).json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

module.exports = blogsRouter