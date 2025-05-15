import { useRef, useState } from 'react'
import blogService from '../services/blogs'
import Toggable from './Toggable'

export const BlogForm = ({ setIsCreated, setSuccessMessage }) => {
  // result in controlled or uncontrolled input warning, why?
  // https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable
  //
  // const [formData, setFormData] = useState({
  //   title: '',
  //   author: '',
  //   url: ''
  // });
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const blogFormRef = useRef()

  const stateSetters = {
    title: setTitle,
    author: setAuthor,
    url: setUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    blogFormRef.current.toggleVisibility()

    try {
      await blogService.create({
        title,
        author,
        url
      })

      setTitle('')
      setAuthor('')
      setUrl('')

      setIsCreated(true)
      setSuccessMessage(`a new blog ${title} by ${author} has been added`)
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
  }

  const handleInputChange = (e) => {
    stateSetters[e.target.name]?.(e.target.value)
  }

  const clearForm = (e) => {
    e.preventDefault()

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Toggable buttonLabel="create new blog" ref={blogFormRef}>
      <form onSubmit={handleSubmit} className="my-6">
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            name="title"
            onChange={handleInputChange}
            value={title}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            id="author"
            type="text"
            name="author"
            onChange={handleInputChange}
            value={author}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="url">URL:</label>
          <input
            id="url"
            type="text"
            name="url"
            onChange={handleInputChange}
            value={url}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={clearForm}
            className="px-4 py-2 bg-slate-200 text-black font-medium rounded-md shadow-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:ring-offset-2"
          >
            Clear
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Create
          </button>
        </div>
      </form>
    </Toggable>
  )
}