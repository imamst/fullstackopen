import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'
import { displayNotification } from './notificationReducer'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addAnecdote(state, action) {
      return [...state, action.payload]
    },
    addVote(state, action) {
      return state.map(anecdote =>
        anecdote.id === action.payload ? { ...anecdote, votes: anecdote.votes + 1 } : anecdote
      )
    },
    appendNote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { addAnecdote, addVote, appendNote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.create(content)
    dispatch(addAnecdote({
      ...newAnecdote,
      votes: 0
    }))
    dispatch(displayNotification(`You created "${content}"`), 5000)
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    await anecdoteService.vote(anecdote)
    dispatch(addVote(anecdote.id))
    dispatch(displayNotification(`You voted "${anecdote.content}"`, 5000))
  }
}

export default anecdoteSlice.reducer