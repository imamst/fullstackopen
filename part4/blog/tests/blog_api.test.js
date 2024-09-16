const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the first blog is about how to success', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(e => e.title)

  assert.strictEqual(contents.find(content => content.includes('to Success')).length > 0, true)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    "title": "Blogging is Easy",
    "author": "Imam Setiawan",
    "url": "http://google.co.id",
    "likes": 23
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  
  const contents = blogsAtEnd.map(e => e.title)

  assert(contents.includes('Blogging is Easy'))
})

test('blog without title is not added', async () => {
  const newBlog = {
    "author": "Imam Setiawan",
    "url": "http://google.co.id",
    "likes": 23
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  
  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a specific note can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView)
})

test('a note can be deleted', async () => {
  const notesAtStart = await helper.blogsInDb()
  const noteToDelete = notesAtStart[0]

  await api
    .delete(`/api/blogs/${noteToDelete.id}`)
    .expect(204)

  const notesAtEnd = await helper.blogsInDb()

  const contents = notesAtEnd.map(r => r.title)
  assert(!contents.includes(noteToDelete.title))

  assert.strictEqual(notesAtEnd.length, helper.initialBlogs.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})