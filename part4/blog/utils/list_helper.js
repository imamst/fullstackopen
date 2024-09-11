const _ = require('lodash')

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

const mostBlogs = (blogs) => {
  // Group blogs by author
  const blogsByAuthor = _.groupBy(blogs, 'author');

  // Map each author to their number of blogs
  const authorBlogCounts = _.map(blogsByAuthor, (blogs, author) => ({
    author: author,
    blogs: blogs.length
  }));

  // Find the author with the maximum number of blogs
  return _.maxBy(authorBlogCounts, 'blogs');
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}