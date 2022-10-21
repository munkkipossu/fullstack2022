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

test('adding blog without likes sets the value to zero', async () => {
  const title = 'The art of breakfasts'
  const newBlog = {
    title: title,
    author: 'Peregrin Took',
    url: 'www.tooks.me/breakfasts/truth-about-breakfasts',
  }

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    if (blog.title === title){
      expect(blog.likes).toBeDefined()
      expect(blog.likes).toBe(0)
    }
  })
})

afterAll(() => {
  mongoose.connection.close()
})