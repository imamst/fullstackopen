const Blog = require('../models/blog')

const initialBlogs = [
  {
    "title": "The Easiest Way to Success Before You Born",
    "author": "Imam Setiawan",
    "url": "http://google.co.id",
    "likes": 79
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}