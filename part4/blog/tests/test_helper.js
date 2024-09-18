const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    "title": "The Easiest Way to Success Before You Born",
    "author": "Imam Setiawan",
    "url": "http://google.co.id",
    "likes": 79
  },
  {
    "title": "Just Getting Right",
    "author": "Imam Setiawan",
    "url": "http://google.co.id",
    "likes": 23
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', 'url': 'http://ai.com' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}