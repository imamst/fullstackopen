import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import { BlogForm } from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [isCreated, setIsCreated] = useState(false)
  const [isUpdated, setIsUpdated] = useState(false)

  const logout = () => {
    window.localStorage.removeItem("user")
    setUser(null)
    setBlogs([])
  }

  useEffect(() => {
    if (user?.token || isCreated || isUpdated) {
      blogService.getAll(user?.token)
      .then(blogs =>
        setBlogs(blogs.sort((a, b) => b.likes - a.likes))
      ).then(() => {
        setIsCreated(false)
        setIsUpdated(false)
      })
    }
  }, [user?.token, isCreated, isUpdated])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("user")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (errorMessage) {
      setSuccessMessage(null)
    } else if (successMessage) {
      setErrorMessage(null)
    }
  }, [errorMessage, successMessage])

  return (
    <div className='p-8 max-w-xl'>
      <h2 className='font-bold text-xl'>Blogs</h2>

      { errorMessage ?
        <p className="my-4 bg-red-200 text-red-500 px-4 py-2 rounded-md font-semibold">{errorMessage}</p>
        : <></>}

      { successMessage ?
        <p className="my-4 bg-green-200 text-green-500 px-4 py-2 rounded-md font-semibold">{successMessage}</p>
        : <></>}

      {
        user === null ? (
          <LoginForm  setUser={setUser} setErrorMessage={setErrorMessage} />
        ) : (
          <div>
            <p>
              {user.name} logged-in
              <button
                onClick={logout}
                className='ml-4 px-4 py-2 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
              >
                Logout
              </button>
            </p>

            <BlogForm setIsCreated={setIsCreated} setSuccessMessage={setSuccessMessage} />

            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} setIsUpdated={setIsUpdated} />
            )}
          </div>
        )
      }
    </div>
  )
}

export default App