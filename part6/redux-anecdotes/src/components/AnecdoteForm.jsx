import { useRef } from 'react'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'
import { removeNotification, setNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
    const anecdoteRef = useRef(null)
    const dispatch = useDispatch()

    const addAnecdote = (event) => {

        event.preventDefault()
        const content = anecdoteRef.current.value
        anecdoteRef.current.value = ''

        const newAnecdote = anecdoteService.create(content)
        dispatch(createAnecdote(newAnecdote))
        dispatch(setNotification(`You created "${content}"`))

        setTimeout(() => {
            dispatch(removeNotification())
        }, 5000)
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div><input ref={anecdoteRef} /></div>
                <button>create</button>
            </form>
        </>
    )
}

export default AnecdoteForm