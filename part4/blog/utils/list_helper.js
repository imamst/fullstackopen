const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((accumulateValue, currentValue) => accumulateValue + currentValue?.likes, 0)
}

module.exports = {
  dummy,
  totalLikes
}