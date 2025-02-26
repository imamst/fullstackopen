import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import { BlogForm } from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isCreated, setIsCreated] = useState(false)

  const logout = () => {
    window.localStorage.removeItem("user")
    setUser(null)
    setBlogs([])
  }

  useEffect(() => {
    if (user?.token || isCreated) {
      blogService.getAll(user?.token).then(blogs =>
        setBlogs( blogs )
      ).then(() => setIsCreated(false))
    }
  }, [user?.token, isCreated])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("user")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <div>
      <h2>blogs</h2>

      { errorMessage ? <p className="text-red-500 my-4">{errorMessage}</p> : <></>}

      {
        user === null ? (
          <LoginForm  setUser={setUser} setErrorMessage={setErrorMessage} />
        ) : (
          <div>
            <p>{user.name} logged-in <button onClick={logout}>logout</button></p>

            <BlogForm setIsCreated={setIsCreated} />

            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
          </div>
        )
      }
    </div>
  )
}

export default App