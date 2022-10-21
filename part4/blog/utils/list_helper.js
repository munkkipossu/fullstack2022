const dummy = (blogs) => {
  return 1
}
  
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0)
    return null
  
  favourites = [...blogs]
  favourites.sort((x, y) => x.likes < y.likes ? 1 : -1)

  return {
    title: favourites[0].title,
    author: favourites[0].author,
    likes: favourites[0].likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0)
    return null
  
  const blogCounts = blogs.reduce(
    (data, blog) => {
      data[blog.author] = data[blog.author] || {author: blog.author, blogs: 0}
      data[blog.author].blogs++
      return data
    }, 
    {}
  )
  const sortedCounts = Object.values(blogCounts)
  sortedCounts.sort((x, y) => x.blogs < y.blogs ? 1 : -1)

  return sortedCounts[0]
}

const mostLikes = (blogs) => {
  if (blogs.length === 0)
    return null

  const likeCounts = blogs.reduce(
    (data, blog) => {
      data[blog.author] = data[blog.author] || {author: blog.author, likes: 0}
      data[blog.author].likes = data[blog.author].likes + blog.likes
      return data
    },
    {}
  )
  const sortedLikes = Object.values(likeCounts)
  sortedLikes.sort((x, y) => x.likes < y.likes ? 1 : -1)
  console.log(sortedLikes)
  return sortedLikes[0]
}


module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}