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

test('blog has id property', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('adding a blog is saved', async () => {
  const title = 'Po-ta-toes - smash \'em'
  const newBlog = {
    title: title,
    author: 'SamWise',
    url: 'www.bagend.me/recepies/potates/mashem',
    likes: 3123213,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(response.body.map(blog => blog.title)).toContain(title)
}, 100000)

afterAll(() => {
  mongoose.connection.close()
})