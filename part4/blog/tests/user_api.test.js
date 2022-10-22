const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./user_test_helper')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  helper.initialUsers.forEach(async (user) => {
    let userObject = new User(user)
    await userObject.save()
  })
})

test('user creation works', async () => {
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
    
  const response = await api.get('/api/users')
  expect(response.body).toHaveLength(helper.initialUsers.length + 1)
  expect(response.body.map(u => u.name)).toContain('Gimli')
})

test('user creation with problematic password fails', async ()  => {
  const newUser = {
    username: 'aaa',
    password: 'a',
    name: 'bbbb'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    
  const response = await api.get('/api/users')
  expect(response.body).toHaveLength(helper.initialUsers.length)
})


test('user creation with no password fails', async ()  => {
  const newUser = {
    username: 'aaa',
    name: 'bbbb'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    
  const response = await api.get('/api/users')
  expect(response.body).toHaveLength(helper.initialUsers.length)
})


test('user creation with problematic username fails', async ()  => {
  const newUser = {
    username: 'a',
    password: 'aaa',
    name: 'bbbb'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    
  const response = await api.get('/api/users')
  expect(response.body).toHaveLength(helper.initialUsers.length)
})


test('user creation with no username fails', async ()  => {
  const newUser = {
    password: 'aaa',
    name: 'bbbb'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    
  const response = await api.get('/api/users')
  expect(response.body).toHaveLength(helper.initialUsers.length)
})


test('user creation requires unique username', async ()  => {
  const newUser = {
    username: 'friend',
    password: 'treeslaalalalallaaaaa',
    name: 'Legolas'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    
  const response = await api.get('/api/users')
  expect(response.body).toHaveLength(helper.initialUsers.length + 1)

  const secondUser = {
    username: 'friend',
    password: 'muahhahaaa',
    name: 'Gimli'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const secondResponse = await api.get('/api/users')
  console.log(secondResponse.body)
  expect(secondResponse.body).toHaveLength(helper.initialUsers.length + 1)
})



