import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { useEffect, useState } from 'react'

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