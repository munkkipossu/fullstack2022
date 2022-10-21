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

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
}