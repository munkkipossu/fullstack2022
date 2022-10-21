const Blog = require('../models/blog')

const initialBlogs = [
  {
    "title": "How I met a Balrog",
    "author": "Gandalf the Grey",
    "url": "www.safe-haeven.me/balrog-be-ware",
    "likes": 1231232
  },
  {
    "title": "How I met a Balrog and won",
    "author": "Gandalf the White",
    "url": "www.safe-haeven.me/balrog-be-gone",
    "likes": 12312312312
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}