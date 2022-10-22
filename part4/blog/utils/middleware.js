logger = require('./logger')

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError') {
    if (error.message.toLowerCase().includes('index: username_1 dup key')) {
      return response.status(400).json({error: 'Username is already in use'})
    } else {
      return response.status(500).json({error: 'server error'})
    }
  }

  next(error)
}

module.exports = {
  errorHandler
}