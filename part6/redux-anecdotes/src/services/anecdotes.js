import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const create = async (content) => {
    const object = { content }
    const response = await axios.post(baseUrl, object)
    return response.data
}

const vote = async (votedAnecdote) => {
    const response = await axios.put(`${baseUrl}/${votedAnecdote.id}`, {
        content: votedAnecdote.content,
        votes: votedAnecdote.votes + 1
    })
    return response.data
}

export default { getAll, create, vote }