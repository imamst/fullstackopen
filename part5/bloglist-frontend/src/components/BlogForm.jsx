import { useState } from "react";
import blogService from "../services/blogs"

export const BlogForm = ({setIsCreated}) => {
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

  const stateSetters = {
    title: setTitle,
    author: setAuthor,
    url: setUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await blogService.create({
        title,
        author,
        url
      })

      setTitle('')
      setAuthor('')
      setUrl('')

      setIsCreated(true)

      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = (e) => {
    stateSetters[e.target.name]?.(e.target.value)
  }

  const clearForm = (e) => {
    e.preventDefault();

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input id="title" type="text" name="title" onChange={handleInputChange} value={title} />
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input id="author" type="text" name="author" onChange={handleInputChange} value={author} />
      </div>
      <div>
        <label htmlFor="url">URL:</label>
        <input id="url" type="text" name="url" onChange={handleInputChange} value={url} />
      </div>
      <button onClick={clearForm}>Clear</button>
      <button type="submit">Create</button>
    </form>
  )
};