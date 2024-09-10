const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((accumulateValue, currentValue) => accumulateValue + currentValue?.likes, 0)
}

const favoriteBlog = (blogs) => {
  let topLikedArticle = {
    id: null,
    likes: 0
  }

  blogs.forEach(element => {
    if (element.likes > topLikedArticle.likes) {
      topLikedArticle = element
    }
  });

  return topLikedArticle
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}