const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)
helper = require('./blog_test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  helper.initialBlogs.forEach(async (blog) => {
    let blogOgject = new Blog(blog)
    await blogOgject.save()
  })
})

test('api returns initial blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})