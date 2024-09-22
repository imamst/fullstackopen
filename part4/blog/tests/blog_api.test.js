const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const authUser = {
  "username": "imamst",
  "name": "Imam Setiawan",
  "password": "salainen"
}

let token = null

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const { body: user } = await api.post('/api/users')
      .send(authUser)

    const { body: data } = await api.post('/api/login')
      .set('Content-Type', 'application/json')
      .send({
        "username": authUser.username,
        "password": authUser.password
      })

    token = data.token

    await Blog.deleteMany({})
  
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog({
        ...blog,
        user: user.id
      }))
    
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })
  
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)
  
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('the first blog is about how to success', async () => {
    const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)
  
    const contents = response.body.map(e => e.title)
  
    assert.strictEqual(contents.find(content => content.includes('to Success')).length > 0, true)
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
    
      const blogToView = blogsAtStart[0]
    
      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
      assert.strictEqual(resultBlog.body.title, blogToView.title)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      "title": "Blogging is Easy",
      "author": "Imam Setiawan",
      "url": "http://google.co.id",
      "likes": 23
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
    
    const blogsAtEnd = await helper.blogsInDb()
  
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  })

  test('blog is not added if no token provided', async () => {
    const newBlog = {
      "title": "Blogging is Easy",
      "author": "Imam Setiawan",
      "url": "http://google.co.id",
      "likes": 23
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    
      const blogsAtEnd = await helper.blogsInDb()
  
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  })

  describe('updating a blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
    
      const updatedBlog = { ...blogToUpdate, likes: 100 }
    
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedBlog)
        .expect(200)
    
      const blogsAtEnd = await helper.blogsInDb()
    
      assert.strictEqual(blogsAtEnd[0].likes, 100)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()
    
      await api
        .put(`/api/blogs/${validNonexistingId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
    
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
    
      const blogsAtEnd = await helper.blogsInDb()
    
      const contents = blogsAtEnd.map(r => r.title)
      assert(!contents.includes(blogToDelete.title))
    
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})