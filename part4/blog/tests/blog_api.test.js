const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./blog_test_helper')

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

test('posting blog fails if title or url is missing', async () => {
  const missingTitle = {
    author: 'Bilbo Baggins',
    url: 'www.bag-end.me/elf/truth-about-galadriel',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(missingTitle)
    .expect(400)

  const missingUrl = {
    title: 'Wrong places to store a magical ring',
    author: 'Frodo Baggins',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(missingUrl)
    .expect(400)

})

test('remove blog', async () => {
  const reponse = await api.get('/api/blogs')
  const id = reponse.body[0].id

  await api.delete(`/api/blogs/${id}`)

  response = await api.get('/api/blogs')
  expect(response.body.map(b => b.id)).not.toContain(id)

},
100000)

test('updating likes works', async () => {
  const response = await api.get('/api/blogs')
  const oldNote = response.body[0]

  await api
    .put(`/api/blogs/${oldNote.id}`)
    .send({likes: 666})
    .expect(200)

  const changedResponse = await api.get('/api/blogs')
  expect(changedResponse.body.map(b => b.likes)).toContain(666)

})

afterAll(() => {
  mongoose.connection.close()
})