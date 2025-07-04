import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'
import { removeNotification, setNotification } from './notificationReducer'

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
    dispatch(addAnecdote(newAnecdote))
    dispatch(setNotification(`You created "${content}"`))

    setTimeout(() => {
        dispatch(removeNotification())
    }, 5000)
  }
}

export default anecdoteSlice.reducer