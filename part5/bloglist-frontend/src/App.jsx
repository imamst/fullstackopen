import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (user?.token) {
      blogService.getAll(user?.token).then(blogs =>
        setBlogs( blogs )
      )
    }
  }, [user?.token])

  return (
    <div>
      <h2>blogs</h2>

      { errorMessage ? <p className="text-red-500 my-4">{errorMessage}</p> : <></>}

      {
        user === null ? (
          <LoginForm  setUser={setUser} setErrorMessage={setErrorMessage} />
        ) : (
          <div>
            <p>{user.name} logged-in</p>
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