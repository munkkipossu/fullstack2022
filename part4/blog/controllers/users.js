const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const body = request.body
    const saltRounds = 10
    const user = new User({
        username: body.username,
        password: await bcrypt.hash(body.password, saltRounds),
        name: body.name,
    })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = usersRouter