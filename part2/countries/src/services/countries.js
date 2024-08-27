import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () => {
  return axios.get(`${baseUrl}/all`)
    .then(({data}) => data)
}

const getDetail = name => {
  return axios.get(`${baseUrl}/name/${name}`)
    .then(({data}) => data)
}

export default {
  getAll,
  getDetail
}