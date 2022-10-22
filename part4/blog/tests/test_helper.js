const Blog = require('../models/blog')
const User = require('../models/user')

const initialUsers = [
  {
    username: 'fool',
    password: 'merrywillneverthinkofthis',
    name: 'Peregrin Took',
    blogs: [
      {
        'title': 'How I met a Balrog',
        'author': 'Gandalf the Grey',
        'url': 'www.safe-haeven.me/balrog-be-ware',
        'likes': 1231232
      },
    ]
  },
  {
    username: 'merry',
    password: 'hahiamsosmart',
    name: 'Meriadoc Brandybuck',
    blogs: [
      {
        'title': 'How I met a Balrog and won',
        'author': 'Gandalf the White',
        'url': 'www.safe-haeven.me/balrog-be-gone',
        'likes': 12312312312
      }
    ]
  },
]

const initialBlogs = initialUsers.reduce((p, c) => p.concat(c.blogs), [])

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialUsers,
  initialBlogs,
  usersInDb,
  blogsInDb,
}