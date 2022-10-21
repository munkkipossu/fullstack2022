const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
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
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
    })
  
    const savedBlog = await blog.save()
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