import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { useEffect, useState } from 'react'
import { removeNotification, setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const filterString = useSelector(state => state.filter)
    const dispatch = useDispatch()

    const [displayedAnecdotes, setDisplayedAnecdotes] = useState();

    useEffect(() => {
      setDisplayedAnecdotes(
        [...(anecdotes || [])].sort((a, b) => b.votes - a.votes).filter(anecdote => anecdote.content?.includes(filterString))
      )
    }, [anecdotes, filterString])

    const vote = (id) => {
        console.log('vote', id)
    
        dispatch(addVote(id))
        dispatch(setNotification(`You voted "${anecdotes?.find((anecdote) => anecdote.id == id)?.content}"`))

        setTimeout(() => {
          dispatch(removeNotification())
        }, 5000)
    }
    
    return (
        <>
            {
                displayedAnecdotes?.map(anecdote =>
                    <div key={anecdote.id}>
                      <div>
                        {anecdote.content}
                      </div>
                      <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id)}>vote</button>
                      </div>
                    </div>
                )
            }
        </>
    )
}

export default AnecdoteList