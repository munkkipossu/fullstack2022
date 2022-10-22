const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const foo = []
  for (let user of helper.initialUsers) {
    const userObject = new User({
      username: user.username,
      password: await bcrypt.hash(user.password, 10),
      name: user.name,
      blogs: []
    })
    const savedUser = await userObject.save()

    for (let blog of user.blogs) {
      let blogObject = new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        user: savedUser.id
      })
      const savedBlog = await blogObject.save()
      savedUser.blogs = savedUser.blogs.concat(savedBlog.id)
      await savedUser.save()
    }
  }

  const userArray = foo.map(o => o.save())
  await Promise.all(userArray)
}, 1000000)

describe('inital blogs', () => {
  test('are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('are returned in correct quantity', async () => {
    const response = await api.get('/api/blogs')
    const initialBlogs = await helper.blogsInDb()
    expect(response.body).toHaveLength(initialBlogs)

    const userResponse = await api.get('/api/users')
    const initialUsers = await helper.usersInDb()
    expect(userResponse.body).toHaveLength(initialUsers)
  })

  test('have user linked to them', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      expect(blog.user).toBeDefined()
    })
  })

  test('have an id property', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined()
    })
  })

  test('are linked from users', async () => {
    const response = await api.get('/api/users')
    response.body.forEach((user) => {
      expect(user.blogs).toHaveLength(1)
    })
  })
})


describe('addition of a blog', () => {
  test('works with valid data', async () => {
    const title = 'Po-ta-toes - smash \'em'
    const newBlog = {
      title: title,
      author: 'SamWise',
      url: 'www.bagend.me/recepies/potates/mashem',
      likes: 3123213,
    }
    const user = helper.initialUsers[0]
    const tokenResponse = await api
      .post('/api/login')
      .send({
        username: user.username,
        password: user.password,
      })
    const token = tokenResponse.body['token']
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(response.body.map(blog => blog.title)).toContain(title)
  }, 100000)

  test('with a wrong token fails', async () => {
    const initialBlogs = await helper.blogsInDb()

    const newBlog = {
      title: 'Po-ta-toes - smash \'em',
      author: 'SamWise',
      url: 'www.bagend.me/recepies/potates/mashem',
      likes: 3123213,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer foobar')
      .send(newBlog)
      .expect(401)

    const endBlogs = await helper.blogsInDb()
    expect(endBlogs).toHaveLength(initialBlogs.length)

  }, 100000)


  test('without likes sets the value to zero', async () => {
    const title = 'The art of breakfasts'
    const newBlog = {
      title: title,
      author: 'Peregrin Took',
      url: 'www.tooks.me/breakfasts/truth-about-breakfasts',
    }
    const user = helper.initialUsers[0]
    const tokenResponse = await api
      .post('/api/login')
      .send({
        username: user.username,
        password: user.password,
      })
    const token = tokenResponse.body['token']
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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

  test('without title or url fails', async () => {
    const missingTitle = {
      author: 'Bilbo Baggins',
      url: 'www.bag-end.me/elf/truth-about-galadriel',
      likes: 1
    }

    const user = helper.initialUsers[0]
    const tokenResponse = await api
      .post('/api/login')
      .send({
        username: user.username,
        password: user.password,
      })
    const token = tokenResponse.body['token']

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(missingTitle)
      .expect(400)

    const missingUrl = {
      title: 'Wrong places to store a magical ring',
      author: 'Frodo Baggins',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(missingUrl)
      .expect(400)

  })

})

describe('removing a blog', () => {
  test('works when user deletes own blog', async () => {
    const blogResponse = await api.get('/api/blogs')
    const blog = blogResponse.body[0]

    const userInfo = {
      username: blog.user.username
    }
    for (let user of helper.initialUsers){
      if (user.username === blog.user.username){
        userInfo.password = user.password
      }
    }
    const tokenResponse = await api
      .post('/api/login')
      .send(userInfo)
    const token = tokenResponse.body['token']

    await api
      .delete(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const response = await api.get('/api/blogs')
    expect(response.body.map(b => b.id)).not.toContain(blog.id)
  },
  100000)

  test('fails with wrong user token', async () => {
    const initialBlogs = await helper.blogsInDb()
    const blogResponse = await api.get('/api/blogs')
    const blog = blogResponse.body[0]

    const userInfo = {
      username: blog.user.username
    }
    for (let user of helper.initialUsers){
      if (user.username !== blog.user.username){
        userInfo.password = user.password
      }
    }
    const tokenResponse = await api
      .post('/api/login')
      .send(userInfo)
    const token = tokenResponse.body['token']

    await api
      .delete(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    const endBlogs = await helper.blogsInDb()
    expect(endBlogs).toHaveLength(initialBlogs.length)
  }, 10000)

  test('fails without proper token', async () => {
    const blogResponse = await api.get('/api/blogs')
    const blog = blogResponse.body[0]
    const initialBlogs = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${blog.id}`)
      .set('Authorization', 'Bearer foobar')
      .expect(401)

    const endBlogs = await helper.blogsInDb()
    expect(endBlogs).toHaveLength(initialBlogs.length)
  }, 10000)
})

test('updating likes works', async () => {
  const response = await api.get('/api/blogs')
  const oldNote = response.body[0]

  await api
    .put(`/api/blogs/${oldNote.id}`)
    .send({ likes: 666 })
    .expect(200)

  const changedResponse = await api.get('/api/blogs')
  expect(changedResponse.body.map(b => b.likes)).toContain(666)

})

afterAll(() => {
  mongoose.connection.close()
})