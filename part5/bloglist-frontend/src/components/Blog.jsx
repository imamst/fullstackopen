import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setIsUpdated }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const parentStyle = {
    border: '1px solid #ccc',
    padding: 10,
  }

  const titleStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    paddingBottom: 10,
    display: 'flex',
    gap: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  }

  const likesStyle = {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  }

  const handleLike = async () => {
    try {
      await blogService.update(blog.id, {
        ...blog,
        likes: (blog.likes || 0) + 1
      })

      setIsUpdated(true)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.remove(blog.id)
        setIsUpdated(true)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div style={parentStyle} className='blog-container'>
      <div style={titleStyle}>
        <div className='flex flex-col gap-2'>
          <p>{blog.title}</p>
          <p>{blog.author}</p>
        </div>
        <button
          onClick={toggleDetails}
          className="px-4 py-2 text-blue-500 font-medium rounded-lg shadow-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >{detailsVisible ? 'hide' : 'view'}</button>
      </div>
      {detailsVisible && (
        <div className='blog-detail'>
          <p>{blog.url}</p>
          <div style={likesStyle}>
            <p>likes {blog.likes}</p>
            <button
              className="px-4 py-2 text-purple-500 font-medium rounded-lg shadow-md hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              onClick={handleLike}
            >like</button>
          </div>
          <button
            className="px-4 py-2 text-red-500 font-medium rounded-lg shadow-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={handleDelete}
          >delete</button>
        </div>
      )}
    </div>
  )
}

export default Blog