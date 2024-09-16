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

test('there are one blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 1)
})

test('the first blog is about how to success', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(e => e.title)

  assert.strictEqual(contents.find(content => content.includes('to Success')).length > 0, true)
})

after(async () => {
  await mongoose.connection.close()
})