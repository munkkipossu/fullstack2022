const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    if (!body.title){
        return response.status(400).end()
    }
    if (!body.url){
        return response.status(400).end()
    }
    const users = await User.find({})
    const user = users[0]
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id
    })
  
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  console.log(request.body.likes)
  console.log(request.params.id)
  
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {likes: request.body.likes},
    {new: true}
  )
  console.log(updatedBlog)
  response.json(updatedBlog)
})

module.exports = blogsRouter