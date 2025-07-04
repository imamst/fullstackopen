import { useRef } from 'react'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'

const AnecdoteForm = () => {
    const anecdoteRef = useRef(null)
    const dispatch = useDispatch()

    const saveAction = (event) => {
        event.preventDefault()
        const content = anecdoteRef.current.value
        anecdoteRef.current.value = ''

        dispatch(createAnecdote(content))
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={saveAction}>
                <div><input ref={anecdoteRef} /></div>
                <button>create</button>
            </form>
        </>
    )
}

export default AnecdoteForm