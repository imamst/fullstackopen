import { useSelector, useDispatch } from 'react-redux'
import { useRef } from 'react'
import { addVote, createAnecdote } from './reducers/anecdoteReducer'

const App = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()
  const anecdoteRef = useRef(null)
  const vote = (id) => {
    console.log('vote', id)

    dispatch(addVote(id))
  }

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = anecdoteRef.current.value
    anecdoteRef.current.value = ''

    console.log('content', content)
    
    dispatch(createAnecdote(content))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input ref={anecdoteRef} /></div>
        <button>create</button>
      </form>
    </div>
  )
}

export default App