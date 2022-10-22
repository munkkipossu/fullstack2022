const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null}

const tokenExtractor = (request, response, next) => {
  const token = getTokenFrom(request)
  if (token){
    request.token = token
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const token = getTokenFrom(request)
  try {
    if (token){
      const decodedToken = jwt.verify(token, process.env.SECRET)
      const user = await User.findById(decodedToken.id)
      request.user = user
    }
  } catch (exception) {
    next(exception)
  }
  next()
}


const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError') {
    if (error.message.toLowerCase().includes('index: username_1 dup key')) {
      return response.status(400).json({ error: 'Username is already in use' } )
    } else {
      return response.status(500).json({ error: 'server error' } )
    }
  } else if (error.name === 'JsonWebTokenError'){
    return response.status(401).end()
  }

  next(error)
}

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor
}