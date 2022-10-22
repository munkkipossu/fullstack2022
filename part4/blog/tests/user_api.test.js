const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const dbObjects = []
  helper.initialUsers.forEach(async (user) => {
    let userObject = new User({
      username: user.username,
      password: user.password,
      name: user.name,
      blogs: []
    })
    dbObjects.push(userObject)
  })
  const promiseArray = dbObjects.map(o => o.save())
  await Promise.all(promiseArray)
})

test('getting users works', async () => {
  const response = await api.get('/api/users')
  const users = await helper.usersInDb()
  expect(response.body).toHaveLength(users.length)
})


describe('user creation', () => {
  test('works when all is ok', async () => {
    const newUser = {
      username: 'axe',
      password: 'mithril',
      name: 'Gimli'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)
    expect(usersAtEnd.map(u => u.name)).toContain('Gimli')
  })

  test('fails with problematic password', async ()  => {
    const newUser = {
      username: 'aaa',
      password: 'a',
      name: 'bbbb'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })


  test('fails with a missing password', async ()  => {
    const newUser = {
      username: 'aaa',
      name: 'bbbb'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })


  test('fails with a problematic username', async ()  => {
    const newUser = {
      username: 'a',
      password: 'aaa',
      name: 'bbbb'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })

  test('fails with a missing username', async ()  => {
    const newUser = {
      password: 'aaa',
      name: 'bbbb'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })


  test('requires unique username', async ()  => {
    const newUser = {
      username: 'friend',
      password: 'treeslaalalalallaaaaa',
      name: 'Legolas'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const usersAtMiddle = await helper.usersInDb()
    expect(usersAtMiddle).toHaveLength(helper.initialUsers.length + 1)

    const secondUser = {
      username: 'friend',
      password: 'muahhahaaa',
      name: 'Gimli'
    }

    await api
      .post('/api/users')
      .send(secondUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)
  })
})