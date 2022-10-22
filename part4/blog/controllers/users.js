const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1})
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  const body = request.body
  if (!body.password){
    return response.status(400).json({
      error: 'Password validation failed: `password` is required.'
    })

  }
  if (body.password.length < 3){
    return response.status(400).json({
      error: 'Password validation failed: `password` must be longer than 2 characters'
    })
  }

  const saltRounds = 10
  const user = new User({
    username: body.username,
    password: await bcrypt.hash(body.password, saltRounds),
    name: body.name,
  })
  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter