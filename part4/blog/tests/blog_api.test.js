const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// test('there are one blogs', async () => {
//   const response = await api.get('/api/blogs')

//   assert.strictEqual(response.body.length, 1)
// })

test('the first blog is about how to success', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(e => e.title)

  assert.strictEqual(contents.find(content => content.includes('to Success')).length > 0, true)
})

test('a valid blog can be added', async () => {
  const initialData = await api.get('/api/blogs')

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
  
  const response = await api.get('/api/blogs')

  const contents = response.body.map(e => e.title)

  assert.strictEqual(response.body.length, initialData.body.length + 1)

  assert(contents.includes('Blogging is Easy'))
})

test('blog without title is not added', async () => {
  const initialData = await api.get('/api/blogs')

  const newBlog = {
    "author": "Imam Setiawan",
    "url": "http://google.co.id",
    "likes": 23
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialData.body.length)
})

after(async () => {
  await mongoose.connection.close()
})